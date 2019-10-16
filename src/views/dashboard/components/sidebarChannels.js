// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import getCommunityChannels from 'shared/graphql/queries/community/getCommunityChannelConnection';
import type { GetCommunityChannelConnectionType } from 'shared/graphql/queries/community/getCommunityChannelConnection';
import { connect } from 'react-redux';
import Icon from '../../../components/icons';
import {
  changeActiveChannel,
  changeActiveThread,
} from '../../../actions/dashboardFeed';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import { sortByTitle } from '../../../helpers/utils';
import compose from 'recompose/compose';
import {
  CommunityListName,
  ChannelsContainer,
  ChannelListItem,
  LoadingContainer,
  LoadingBar,
  SectionTitle,
  PendingBadge,
} from '../style';
import GetMembers from 'src/views/communityMembers/components/getMembers';
import { track, events } from 'src/helpers/analytics';
import type { Dispatch } from 'redux';
import { ErrorBoundary } from 'src/components/error';

type Props = {
  dispatch: Dispatch<Object>,
  isLoading: boolean,
  queryVarIsChanging: boolean,
  activeChannel: ?string,
  setActiveChannelObject: Function,
  permissions: {
    isOwner: boolean,
    isModerator: boolean,
  },
  slug: string,
  data: {
    community: GetCommunityChannelConnectionType,
  },
};
class SidebarChannels extends React.Component<Props> {
  changeChannel = id => {
    track(events.INBOX_CHANNEL_FILTERED);
    this.props.dispatch(changeActiveThread(''));
    this.props.dispatch(changeActiveChannel(id));
  };

  setActiveChannelObject = channel => {
    if (!this.props.setActiveChannelObject || !channel) return;
    return this.props.setActiveChannelObject(channel);
  };

  render() {
    const {
      data: { community },
      isLoading,
      queryVarIsChanging,
      activeChannel,
      permissions,
      slug,
    } = this.props;

    const isOwner = permissions && permissions.isOwner;
    const isModerator = permissions && permissions.isModerator;

    if (community) {
      const isOwner =
        community.communityPermissions &&
        community.communityPermissions.isOwner;
      const isModerator =
        community.communityPermissions &&
        community.communityPermissions.isModerator;
      const channels = community.channelConnection.edges
        .map(channel => channel && channel.node)
        .filter(channel => {
          if (!channel) return null;
          if (channel.isPrivate && !channel.channelPermissions.isMember) {
            return null;
          }

          return channel;
        })
        .filter(channel => {
          if (!channel) return null;
          if (channel.isPrivate && channel.isArchived) {
            return null;
          }
          return channel;
        })
        .filter(channel => channel && channel.channelPermissions.isMember)
        .filter(channel => channel && !channel.channelPermissions.isBlocked)
        .filter(channel => channel && !channel.isArchived);

      const sortedChannels = sortByTitle(channels);

      return (
        <ChannelsContainer className={'channelsContainer'}>
          <Link to={`/${community.slug}`}>
            <ChannelListItem>
              <Icon glyph={'link'} size={24} />
              <CommunityListName>View community home</CommunityListName>
            </ChannelListItem>
          </Link>

          {(isOwner || isModerator) && (
            <Link to={`/${community.slug}/settings`}>
              <ChannelListItem>
                <Icon glyph={'settings'} size={24} />
                <CommunityListName>Settings</CommunityListName>
              </ChannelListItem>
            </Link>
          )}

          {community.isPrivate && (
            <GetMembers
              filter={{ isPending: true }}
              id={community.id}
              render={({ isLoading, community, isFetchingMore, fetchMore }) => {
                const members =
                  community &&
                  community.members &&
                  community.members.edges.map(member => member && member.node);

                if (members && members.length > 0) {
                  return (
                    <Link
                      to={`/${community.slug}/settings/members?filter=pending`}
                    >
                      <ChannelListItem>
                        <PendingBadge>{members.length}</PendingBadge>
                        <CommunityListName>Pending requests</CommunityListName>
                      </ChannelListItem>
                    </Link>
                  );
                }

                return null;
              }}
            />
          )}

          {(isOwner || isModerator) && (
            <Link to={`/${community.slug}/settings/analytics`}>
              <ChannelListItem>
                <Icon glyph={'link'} size={24} />
                <CommunityListName>Analytics</CommunityListName>
              </ChannelListItem>
            </Link>
          )}

          {sortedChannels && sortedChannels.length > 1 && (
            <SectionTitle>Filter by Channel</SectionTitle>
          )}
          {sortedChannels &&
            sortedChannels.length > 1 &&
            sortedChannels.map(channel => {
              return (
                <ErrorBoundary fallbackComponent={null} key={channel.id}>
                  <ChannelListItem
                    active={activeChannel === channel.id}
                    data-cy="inbox-channel-list-item"
                    onClick={evt => {
                      evt.stopPropagation();
                      this.changeChannel(channel.id);
                      this.setActiveChannelObject(channel);
                    }}
                  >
                    {channel.isPrivate ? (
                      <Icon glyph="channel-private" size={24} />
                    ) : (
                      <Icon glyph="channel" size={24} />
                    )}

                    <CommunityListName>{channel.name}</CommunityListName>
                  </ChannelListItem>
                </ErrorBoundary>
              );
            })}
        </ChannelsContainer>
      );
    }

    if (isLoading || queryVarIsChanging) {
      return (
        <ChannelsContainer className={'channelsContainer'}>
          <Link to={`/${slug}`}>
            <ChannelListItem>
              <Icon glyph={'link'} size={24} />
              <CommunityListName>Visit community</CommunityListName>
            </ChannelListItem>
          </Link>

          {(isOwner || isModerator) && (
            <Link to={`/${slug}/settings`}>
              <ChannelListItem>
                <Icon glyph={'settings'} size={24} />
                <CommunityListName>Settings</CommunityListName>
              </ChannelListItem>
            </Link>
          )}
          <LoadingContainer>
            <LoadingBar width={56} />
            <LoadingBar width={128} />
            <LoadingBar width={72} />
          </LoadingContainer>
        </ChannelsContainer>
      );
    }

    return null;
  }
}

export default compose(
  connect(),
  getCommunityChannels,
  viewNetworkHandler
)(SidebarChannels);
