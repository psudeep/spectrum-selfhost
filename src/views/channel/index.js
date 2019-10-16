// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import generateMetaInfo from 'shared/generate-meta-info';
import { CommunityAvatar } from 'src/components/avatar';
import { addCommunityToOnboarding } from 'src/actions/newUserOnboarding';
import ComposerPlaceholder from 'src/components/threadComposer/components/placeholder';
import Head from 'src/components/head';
import AppViewWrapper from 'src/components/appViewWrapper';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import ViewError from 'src/components/viewError';
import { Link } from 'react-router-dom';
import ThreadFeed from 'src/components/threadFeed';
import PendingUsersNotification from './components/pendingUsersNotification';
import NotificationsToggle from './components/notificationsToggle';
import getChannelThreadConnection from 'shared/graphql/queries/channel/getChannelThreadConnection';
import { getChannelByMatch } from 'shared/graphql/queries/channel/getChannel';
import type { GetChannelType } from 'shared/graphql/queries/channel/getChannel';
import Login from '../login';
import { LoadingScreen } from 'src/components/loading';
import { Upsell404Channel } from 'src/components/upsell';
import RequestToJoinChannel from 'src/components/upsell/requestToJoinChannel';
import Titlebar from '../titlebar';
import Icon from 'src/components/icons';
import Search from './components/search';
import ChannelMemberGrid from './components/memberGrid';
import { CLIENT_URL } from 'src/api/constants';
import CommunityLogin from 'src/views/communityLogin';
import { withCurrentUser } from 'src/components/withCurrentUser';
import {
  SegmentedControl,
  DesktopSegment,
  Segment,
  MobileSegment,
} from 'src/components/segmentedControl';
import {
  Grid,
  Meta,
  Content,
  Extras,
  CommunityContext,
  CommunityName,
  ChannelName,
  ChannelDescription,
  MetadataContainer,
} from './style';
import { ExtLink, OnlineIndicator } from 'src/components/profile/style';
import { CoverPhoto } from 'src/components/profile/coverPhoto';
import {
  LoginButton,
  ColumnHeading,
  MidSegment,
  SettingsButton,
  LoginOutlineButton,
} from '../community/style';
import ToggleChannelMembership from 'src/components/toggleChannelMembership';
import { track, events, transformations } from 'src/helpers/analytics';
import type { Dispatch } from 'redux';
import { ErrorBoundary } from 'src/components/error';

const ThreadFeedWithData = compose(
  connect(),
  getChannelThreadConnection
)(ThreadFeed);

type Props = {
  match: {
    params: {
      communitySlug: string,
      channelSlug: string,
    },
  },
  data: {
    channel: GetChannelType,
  },
  currentUser: Object,
  isLoading: boolean,
  hasError: boolean,
  dispatch: Dispatch<Object>,
};

type State = {
  selectedView: 'threads' | 'search' | 'members',
};

class ChannelView extends React.Component<Props, State> {
  state = {
    selectedView: 'threads',
  };

  componentDidMount() {
    if (this.props.data && this.props.data.channel) {
      const { channel } = this.props.data;

      track(events.CHANNEL_VIEWED, {
        channel: transformations.analyticsChannel(channel),
        community: transformations.analyticsCommunity(channel.community),
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (
      (!prevProps.data.channel && this.props.data.channel) ||
      (prevProps.data.channel &&
        this.props.data.channel &&
        prevProps.data.channel.id !== this.props.data.channel.id)
    ) {
      const { channel } = this.props.data;

      if (channel) {
        track(events.CHANNEL_VIEWED, {
          channel: transformations.analyticsChannel(channel),
          community: transformations.analyticsCommunity(channel.community),
        });
      }

      // if the user is new and signed up through a community page, push
      // the community data into the store to hydrate the new user experience
      // with their first community they should join
      if (this.props.currentUser) return;
      this.props.dispatch(
        addCommunityToOnboarding(this.props.data.channel.community)
      );
    }
  }

  handleSegmentClick = label => {
    if (this.state.selectedView === label) return;

    return this.setState({
      selectedView: label,
    });
  };

  renderActionButton = (channel: GetChannelType) => {
    if (!channel) return null;

    const {
      isOwner: isChannelOwner,
      isMember: isChannelMember,
    } = channel.channelPermissions;
    const { communityPermissions } = channel.community;
    const {
      isOwner: isCommunityOwner,
      isModerator: isCommunityModerator,
    } = communityPermissions;
    const isGlobalOwner = isChannelOwner || isCommunityOwner;
    const isGlobalModerator = isCommunityModerator;

    const loginUrl = channel.community.brandedLogin.isEnabled
      ? `/${channel.community.slug}/login?r=${CLIENT_URL}/${
          channel.community.slug
        }/${channel.slug}`
      : `/login?r=${CLIENT_URL}/${channel.community.slug}/${channel.slug}`;

    // logged in
    if (!this.props.currentUser) {
      // user isnt logged in, prompt a login-join
      return (
        <Link to={loginUrl}>
          <LoginButton data-cy="channel-login-join-button">
            Join {channel.name}
          </LoginButton>
        </Link>
      );
    }

    // logged out
    if (this.props.currentUser) {
      // show settings button if owns channel or community
      if (isGlobalOwner) {
        return (
          <Link to={`/${channel.community.slug}/${channel.slug}/settings`}>
            <SettingsButton
              icon={'settings'}
              isMember
              data-cy="channel-settings-button"
            >
              Settings
            </SettingsButton>
          </Link>
        );
      }

      if (isGlobalModerator) {
        return (
          <React.Fragment>
            <ToggleChannelMembership
              channel={channel}
              render={state => {
                if (isChannelMember) {
                  return (
                    <LoginOutlineButton
                      loading={state.isLoading}
                      dataCy={'channel-leave-button'}
                    >
                      Leave channel
                    </LoginOutlineButton>
                  );
                } else {
                  return (
                    <LoginButton
                      loading={state.isLoading}
                      dataCy="channel-join-button"
                    >
                      Join {channel.name}
                    </LoginButton>
                  );
                }
              }}
            />

            <Link to={`/${channel.community.slug}/${channel.slug}/settings`}>
              <SettingsButton
                icon={'settings'}
                isMember
                data-cy="channel-settings-button"
              >
                Settings
              </SettingsButton>
            </Link>
          </React.Fragment>
        );
      }

      // otherwise prompt a join
      return (
        <ToggleChannelMembership
          channel={channel}
          render={state => {
            if (isChannelMember) {
              return (
                <LoginOutlineButton
                  loading={state.isLoading}
                  dataCy={'channel-leave-button'}
                >
                  Leave channel
                </LoginOutlineButton>
              );
            } else {
              return (
                <LoginButton
                  loading={state.isLoading}
                  dataCy="channel-join-button"
                >
                  Join {channel.name}
                </LoginButton>
              );
            }
          }}
        />
      );
    }
  };

  render() {
    const {
      match,
      data: { channel },
      currentUser,
      isLoading,
      hasError,
    } = this.props;
    const { selectedView } = this.state;
    const { communitySlug } = match.params;
    const isLoggedIn = currentUser;

    if (channel && channel.id) {
      // at this point the view is no longer loading, has not encountered an error, and has returned a channel record
      const {
        isBlocked,
        isPending,
        isMember,
        isOwner,
        isModerator,
      } = channel.channelPermissions;
      const { community } = channel;
      const userHasPermissions = isMember || isOwner || isModerator;
      const isRestricted = channel.isPrivate && !userHasPermissions;
      const hasCommunityPermissions =
        !community.isPrivate || community.communityPermissions.isMember;
      const isGlobalOwner =
        isOwner || channel.community.communityPermissions.isOwner;

      const redirectPath = `${CLIENT_URL}/${community.slug}/${channel.slug}`;

      // if the channel is private but the user isn't logged in, redirect to the login page
      if (!isLoggedIn && channel.isPrivate) {
        if (community.brandedLogin.isEnabled) {
          return <CommunityLogin redirectPath={redirectPath} match={match} />;
        } else {
          return <Login redirectPath={redirectPath} />;
        }
      }

      // user has explicitly been blocked from this channel
      if (
        isBlocked ||
        community.communityPermissions.isBlocked ||
        !hasCommunityPermissions
      ) {
        return (
          <AppViewWrapper>
            <Titlebar
              title={'Private channel'}
              provideBack={true}
              backRoute={`/${communitySlug}`}
              noComposer
            />
            <ViewError
              emoji={'✋'}
              heading={'You don’t have permission to view this channel.'}
              subheading={`Head back to the ${communitySlug} community to get back on track.`}
              dataCy={'channel-view-blocked'}
            >
              <Upsell404Channel community={communitySlug} />
            </ViewError>
          </AppViewWrapper>
        );
      }

      // channel is private and the user is not a member or owner
      if (isRestricted) {
        return (
          <AppViewWrapper>
            <Titlebar
              title={channel.name}
              subtitle={community.name}
              provideBack={true}
              backRoute={`/${communitySlug}`}
              noComposer
            />
            <ViewError
              emoji={isPending ? '🕓' : '🔑'}
              heading={
                isPending
                  ? 'Your request to join this channel is pending'
                  : 'This channel is private'
              }
              subheading={
                isPending
                  ? `Return to the ${
                      community.name
                    } community until you hear back.`
                  : `Request to join this channel and the admins of ${
                      community.name
                    } will be notified.`
              }
              dataCy={'channel-view-is-restricted'}
            >
              <RequestToJoinChannel
                channel={channel}
                community={community}
                isPending={isPending}
              />
            </ViewError>
          </AppViewWrapper>
        );
      }

      // at this point the user has full permission to view the channel
      const { title, description } = generateMetaInfo({
        type: 'channel',
        data: {
          name: channel.name,
          communityName: community.name,
          description: channel.description,
        },
      });

      const actionButton = this.renderActionButton(channel);

      return (
        <AppViewWrapper data-cy="channel-view">
          <Head
            title={title}
            description={description}
            image={community.profilePhoto}
          />
          <Titlebar
            title={channel.name}
            subtitle={community.name}
            provideBack={true}
            backRoute={`/${communitySlug}`}
            noComposer={!isMember}
            activeCommunityId={channel.community.id}
            activeChannelId={channel.id}
          />
          <Grid id="main">
            <CoverPhoto src={community.coverPhoto} />
            <Meta data-cy="channel-profile-full">
              <CommunityContext>
                <CommunityAvatar community={community} />
                <Link to={`/${community.slug}`}>
                  <CommunityName>{community.name}</CommunityName>
                </Link>
              </CommunityContext>

              <ChannelName>
                {channel.name}
                {channel.isArchived && ' (Archived)'}
              </ChannelName>
              {channel.description && (
                <ChannelDescription>{channel.description}</ChannelDescription>
              )}

              <MetadataContainer>
                {channel.metaData && channel.metaData.members && (
                  <ExtLink>
                    <Icon glyph="person" size={24} />
                    {channel.metaData.members.toLocaleString()}
                    {channel.metaData.members > 1 ? ' members' : ' member'}
                  </ExtLink>
                )}

                {channel.metaData &&
                  typeof channel.metaData.onlineMembers === 'number' && (
                    <ExtLink>
                      <OnlineIndicator
                        offline={channel.metaData.onlineMembers === 0}
                      />
                      {channel.metaData.onlineMembers.toLocaleString()} online
                    </ExtLink>
                  )}

                <div style={{ height: '8px' }} />

                {actionButton}
              </MetadataContainer>

              {isLoggedIn && userHasPermissions && !channel.isArchived && (
                <ErrorBoundary fallbackComponent={null}>
                  <NotificationsToggle
                    value={channel.channelPermissions.receiveNotifications}
                    channel={channel}
                  />
                </ErrorBoundary>
              )}

              {/* user is signed in and has permissions to view pending users */}
              {isLoggedIn && (isOwner || isGlobalOwner) && (
                <ErrorBoundary fallbackComponent={null}>
                  <PendingUsersNotification channel={channel} id={channel.id} />
                </ErrorBoundary>
              )}
            </Meta>
            <Content>
              <SegmentedControl style={{ margin: '16px 0 0 0' }}>
                <DesktopSegment
                  segmentLabel="search"
                  onClick={() => this.handleSegmentClick('search')}
                  selected={selectedView === 'search'}
                  data-cy="channel-search-tab"
                >
                  <Icon glyph={'search'} />
                  Search
                </DesktopSegment>
                <Segment
                  segmentLabel="threads"
                  onClick={() => this.handleSegmentClick('threads')}
                  selected={selectedView === 'threads'}
                >
                  Threads
                </Segment>
                <MidSegment
                  segmentLabel="members"
                  onClick={() => this.handleSegmentClick('members')}
                  selected={selectedView === 'members'}
                >
                  Members (
                  {channel.metaData &&
                    channel.metaData.members &&
                    channel.metaData.members.toLocaleString()}
                  )
                </MidSegment>
                <MobileSegment
                  segmentLabel="members"
                  onClick={() => this.handleSegmentClick('members')}
                  selected={selectedView === 'members'}
                >
                  Members
                </MobileSegment>
                <MobileSegment
                  segmentLabel="search"
                  onClick={() => this.handleSegmentClick('search')}
                  selected={selectedView === 'search'}
                >
                  <Icon glyph={'search'} />
                </MobileSegment>
              </SegmentedControl>

              {/* if the user is logged in and has permissions to post, and the channel is either private + paid, or is not private, show the composer */}
              {isLoggedIn &&
                !channel.isArchived &&
                selectedView === 'threads' &&
                userHasPermissions &&
                ((channel.isPrivate && !channel.isArchived) ||
                  !channel.isPrivate) && (
                  <ErrorBoundary fallbackComponent={null}>
                    <ComposerPlaceholder
                      communityId={channel.community.id}
                      channelId={channel.id}
                    />
                  </ErrorBoundary>
                )}

              {// thread list
              selectedView === 'threads' && (
                <ThreadFeedWithData
                  viewContext="channelProfile"
                  id={channel.id}
                  currentUser={isLoggedIn}
                  channelId={channel.id}
                />
              )}

              {//search
              selectedView === 'search' && (
                <ErrorBoundary>
                  <Search channel={channel} />
                </ErrorBoundary>
              )}

              {// members grid
              selectedView === 'members' && (
                <ErrorBoundary>
                  <ChannelMemberGrid id={channel.id} />
                </ErrorBoundary>
              )}
            </Content>
            <Extras>
              <ErrorBoundary fallbackComponent={null}>
                <ColumnHeading>Members</ColumnHeading>
                <ChannelMemberGrid first={5} id={channel.id} />
              </ErrorBoundary>
            </Extras>
          </Grid>
        </AppViewWrapper>
      );
    }

    if (isLoading) {
      return <LoadingScreen />;
    }

    if (hasError) {
      return (
        <AppViewWrapper>
          <Titlebar
            title={'Channel not found'}
            provideBack={true}
            backRoute={`/${communitySlug}`}
            noComposer
          />
          <ViewError
            refresh
            heading={'There was an error fetching this channel.'}
          />
        </AppViewWrapper>
      );
    }

    return (
      <AppViewWrapper>
        <Titlebar
          title={'Channel not found'}
          provideBack={true}
          backRoute={`/${communitySlug}`}
          noComposer
        />
        <ViewError
          heading={'We couldn’t find a channel with this name.'}
          subheading={`Head back to the ${communitySlug} community to get back on track.`}
          dataCy="channel-not-found"
        >
          <Upsell404Channel community={communitySlug} />
        </ViewError>
      </AppViewWrapper>
    );
  }
}

export default compose(
  withCurrentUser,
  getChannelByMatch,
  viewNetworkHandler,
  connect()
)(ChannelView);
