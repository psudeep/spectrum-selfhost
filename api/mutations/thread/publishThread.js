// @flow
const debug = require('debug')('api:mutations:thread:publish-thread');
import stringSimilarity from 'string-similarity';
import slugg from 'slugg';
import {
  convertToRaw,
  convertFromRaw,
  EditorState,
  SelectionState,
} from 'draft-js';
import { stateFromMarkdown } from 'draft-js-import-markdown';
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { addMessage } from '../message/addMessage';
import { uploadImage } from '../../utils/file-storage';
import processThreadContent from 'shared/draft-utils/process-thread-content';
import {
  publishThread,
  editThread,
  getThreadsByUserAsSpamCheck,
} from '../../models/thread';
import { createParticipantInThread } from '../../models/usersThreads';
import type { FileUpload, DBThread } from 'shared/types';
import {
  toPlainText,
  toJSON,
  toState,
  fromPlainText,
} from 'shared/draft-utils';
import {
  processReputationEventQueue,
  sendThreadNotificationQueue,
  _adminProcessToxicThreadQueue,
  _adminProcessUserSpammingThreadsQueue,
} from 'shared/bull/queues';
import getPerspectiveScore from 'athena/queues/moderationEvents/perspective';
import { events } from 'shared/analytics';
import { trackQueue } from 'shared/bull/queues';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';
import { storeMessage } from '../../models/message';

const threadBodyToPlainText = (body: any): string =>
  toPlainText(toState(JSON.parse(body)));

const MEMBER_SPAM_LMIT = 3;
const SPAM_TIMEFRAME = 60 * 10;

type File = FileUpload;

export type PublishThreadInput = {
  thread: {
    channelId: string,
    communityId: string,
    type: 'SLATE' | 'DRAFTJS' | 'TEXT',
    content: {
      title: string,
      body?: string,
    },
    filesToUpload?: ?Array<File>,
  },
};

export default requireAuth(
  async (_: any, args: PublishThreadInput, ctx: GraphQLContext) => {
    const { user, loaders } = ctx;
    const { thread } = args;

    let { type } = thread;

    if (type === 'SLATE') {
      trackQueue.add({
        userId: user.id,
        event: events.THREAD_CREATED_FAILED,
        context: { channelId: thread.channelId },
        properties: {
          reason: 'slate type',
        },
      });

      return new UserError(
        "You're on an old version of Vanila Community, please refresh your browser."
      );
    }

    if (thread.content.body) {
      thread.content.body = processThreadContent(type, thread.content.body);
    }

    thread.type = 'DRAFTJS';

    const [
      currentUserChannelPermissions,
      currentUserCommunityPermissions,
      channel,
      community,
      usersPreviousPublishedThreads,
    ] = await Promise.all([
      loaders.userPermissionsInChannel.load([user.id, thread.channelId]),
      loaders.userPermissionsInCommunity.load([user.id, thread.communityId]),
      loaders.channel.load(thread.channelId),
      loaders.community.load(thread.communityId),
      getThreadsByUserAsSpamCheck(user.id, SPAM_TIMEFRAME),
    ]);

    if (!community || community.deletedAt) {
      trackQueue.add({
        userId: user.id,
        event: events.THREAD_CREATED_FAILED,
        context: { channelId: thread.channelId },
        properties: {
          reason: 'community doesn’t exist',
        },
      });

      return new UserError('This community doesn’t exist');
    }

    // if channel wasn't found or is deleted
    if (!channel || channel.deletedAt) {
      trackQueue.add({
        userId: user.id,
        event: events.THREAD_CREATED_FAILED,
        context: { channelId: thread.channelId },
        properties: {
          reason: 'channel doesn’t exist',
        },
      });

      return new UserError("This channel doesn't exist");
    }

    if (channel.isArchived) {
      trackQueue.add({
        userId: user.id,
        event: events.THREAD_CREATED_FAILED,
        context: { channelId: thread.channelId },
        properties: {
          reason: 'channel archived',
        },
      });

      return new UserError('This channel has been archived');
    }

    // if user isn't a channel member
    if (
      !currentUserChannelPermissions.isMember ||
      currentUserChannelPermissions.isBlocked ||
      currentUserCommunityPermissions.isBlocked
    ) {
      trackQueue.add({
        userId: user.id,
        event: events.THREAD_CREATED_FAILED,
        context: { channelId: thread.channelId },
        properties: {
          reason: 'no permission',
        },
      });

      return new UserError(
        "You don't have permission to create threads in this channel."
      );
    }

    const isOwnerOrModerator =
      currentUserChannelPermissions.isOwner ||
      currentUserChannelPermissions.isModerator ||
      currentUserCommunityPermissions.isOwner ||
      currentUserCommunityPermissions.isModerator;

    // if user has published other threads in the last hour, check for spam
    if (
      !isOwnerOrModerator &&
      usersPreviousPublishedThreads &&
      usersPreviousPublishedThreads.length > 0
    ) {
      debug(
        'User has posted at least once in the previous 10m - running spam checks'
      );

      if (usersPreviousPublishedThreads.length >= MEMBER_SPAM_LMIT) {
        debug('User has posted at least 3 times in the previous 10m');
        _adminProcessUserSpammingThreadsQueue.add({
          user: user,
          threads: usersPreviousPublishedThreads,
          // $FlowIssue
          publishing: thread,
          community: community,
          channel: channel,
        });

        trackQueue.add({
          userId: user.id,
          event: events.THREAD_CREATED_FAILED,
          context: { channelId: thread.channelId },
          properties: {
            reason: 'user spamming threads',
          },
        });

        return new UserError(
          'You’ve been posting a lot! Please wait a few minutes before posting more.'
        );
      }

      const checkForSpam = usersPreviousPublishedThreads.map(t => {
        if (!t) return false;
        if (
          usersPreviousPublishedThreads.length === 1 &&
          usersPreviousPublishedThreads[0] &&
          usersPreviousPublishedThreads[0].deletedAt
        )
          return false;

        const incomingTitle = thread.content.title;
        const thisTitle = t.content.title;

        const titleSimilarity = stringSimilarity.compareTwoStrings(
          incomingTitle,
          thisTitle
        );
        debug(`Title similarity score for spam check: ${titleSimilarity}`);
        if (titleSimilarity > 0.8) return true;

        if (thread.content.body) {
          const incomingBody = threadBodyToPlainText(thread.content.body);
          const thisBody = threadBodyToPlainText(t.content.body);

          if (incomingBody.length === 0 || thisBody.length === 0) return false;

          const bodySimilarity = stringSimilarity.compareTwoStrings(
            incomingBody,
            thisBody
          );
          debug(`Body similarity score for spam check: ${bodySimilarity}`);
          if (bodySimilarity > 0.8) return true;
        }

        return false;
      });

      const isSpamming = checkForSpam.filter(Boolean).length > 0;

      if (isSpamming) {
        debug('User is spamming similar content');

        trackQueue.add({
          userId: user.id,
          event: events.THREAD_FLAGGED_AS_SPAM,
          context: { channelId: thread.channelId },
        });

        _adminProcessUserSpammingThreadsQueue.add({
          user: user,
          threads: usersPreviousPublishedThreads,
          // $FlowIssue
          publishing: thread,
          community: community,
          channel: channel,
        });

        return new UserError(
          'It looks like you’ve been posting about a similar topic recently - please wait a while before posting more.'
        );
      }
    }

    let threadObject = Object.assign(
      {},
      {
        ...thread,
        content: {
          ...thread.content,
          title: thread.content.title.trim(),
        },
      }
    );

    // $FlowFixMe
    const dbThread: DBThread = await publishThread(threadObject, user.id);

    // we check for toxicity here only to determine whether or not to send
    // email notifications - the thread will be published regardless, but we can
    // prevent some abuse and spam if we ensure people dont get email notifications
    // with titles like "fuck you"
    const checkToxicity = async () => {
      const body = thread.content.body
        ? threadBodyToPlainText(thread.content.body)
        : '';
      const title = thread.content.title;
      const text = `${title} ${body}`;

      const scores = await getPerspectiveScore(text).catch(err =>
        console.error(
          'Error getting thread moderation scores from providers',
          err.message
        )
      );

      const perspectiveScore = scores && scores[1];

      // if neither models returned results
      if (!perspectiveScore) {
        debug('Toxicity checks from providers say not toxic');
        return false;
      }

      // if both services agree that the thread is >= 98% toxic
      if (perspectiveScore >= 0.9) {
        debug('Thread is toxic according to both providers');
        return true;
      }

      return false;
    };

    const threadIsToxic = await checkToxicity();
    if (!isOwnerOrModerator && threadIsToxic) {
      debug(
        'Thread determined to be toxic, not sending notifications or adding rep'
      );

      trackQueue.add({
        userId: user.id,
        event: events.THREAD_FLAGGED_AS_TOXIC,
        context: { threadId: dbThread.id },
      });

      // generate an alert for admins
      _adminProcessToxicThreadQueue.add({ thread: dbThread });
      processReputationEventQueue.add({
        userId: user.id,
        type: 'thread created',
        entityId: dbThread.id,
      });
    } else {
      debug('Thread is not toxic, send notifications and add rep');
      // thread is clean, send notifications and process reputation
      sendThreadNotificationQueue.add({ thread: dbThread });
      processReputationEventQueue.add({
        userId: user.id,
        type: 'thread created',
        entityId: dbThread.id,
      });
    }

    // create a relationship between the thread and the author
    await createParticipantInThread(dbThread.id, user.id);

    // Post a new message with a link to the new thread to the watercooler thread if one exists
    // if (community.watercoolerId && !channel.isPrivate) {
    //   const identifier = user.username ? `@${user.username}` : user.name;
    //   await addMessage(
    //     {
    //       content: {
    //         body: `${identifier} just posted a new thread 📝 https://spectrum.chat/${
    //           community.slug
    //         }/${channel.slug}/${slugg(dbThread.content.title)}~${dbThread.id}`,
    //       },
    //       messageType: 'text',
    //       threadId: community.watercoolerId,
    //       threadType: 'story',
    //     },
    //     'sam'
    //   );
    // }

    if (!thread.filesToUpload || thread.filesToUpload.length === 0) {
      return dbThread;
    }

    let urls;
    try {
      // if the original mutation input contained files to upload
      urls = await Promise.all(
        // upload each of the files to s3
        thread.filesToUpload.map(
          file => file && uploadImage(file, 'threads', dbThread.id)
        )
      );
    } catch (err) {
      trackQueue.add({
        userId: user.id,
        event: events.THREAD_CREATED_FAILED,
        context: { channelId: thread.channelId },
        properties: {
          reason: 'images failed to upload',
        },
      });

      return new UserError(err.message);
    }

    // Replace the local image srcs with the remote image src
    const body = dbThread.content.body && JSON.parse(dbThread.content.body);
    if (!body) return dbThread;

    const imageKeys = Object.keys(body.entityMap).filter(
      key => body.entityMap[key].type.toLowerCase() === 'image'
    );
    urls.forEach((url, index) => {
      if (!body.entityMap[imageKeys[index]]) return;
      body.entityMap[imageKeys[index]].data.src = url;
    });

    // Update the thread with the new links
    return editThread(
      {
        threadId: dbThread.id,
        content: {
          ...dbThread.content,
          body: JSON.stringify(body),
        },
      },
      user.id,
      false
    );
  }
);
