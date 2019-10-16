// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { CommunityAvatar } from 'src/components/avatar';
import compose from 'recompose/compose';
import { Link } from 'react-router-dom';
import Icon from 'src/components/icons';
import Reputation from 'src/components/reputation';
import SidebarChannels from './sidebarChannels';
import UpsellExploreCommunities from './upsellExploreCommunities';
import { getItemFromStorage } from 'src/helpers/localStorage';
import {
  CommunityListItem,
  CommunityListMeta,
  CommunityListName,
  CommunityAvatarContainer,
  CommunityListScroller,
  CommunityListWrapper,
  Fixed,
} from '../style';
import {
  changeActiveCommunity,
  changeActiveThread,
  changeActiveChannel,
} from 'src/actions/dashboardFeed';
import type { GetCommunityType } from 'shared/graphql/queries/community/getCommunity';
import { track, events } from 'src/helpers/analytics';
import type { Dispatch } from 'redux';
import { ErrorBoundary } from 'src/components/error';

type Props = {
  dispatch: Dispatch<Object>,
  history: Object,
  activeCommunity: ?string,
  activeChannel: ?string,
  communities: Array<GetCommunityType>,
  setActiveChannelObject: Function,
};

export const LAST_ACTIVE_COMMUNITY_KEY = 'last-active-inbox-community';

class CommunityList extends React.Component<Props> {
  componentDidMount() {
    const id = getItemFromStorage(LAST_ACTIVE_COMMUNITY_KEY);
    if (id) return this.props.dispatch(changeActiveCommunity(id));
    this.props.dispatch(changeActiveCommunity(''));
  }

  changeCommunity = id => {
    track(events.INBOX_COMMUNITY_FILTERED);
    this.props.dispatch(changeActiveCommunity(id));
    this.props.history.replace('/');
    this.props.dispatch(changeActiveThread(''));

    if (id !== this.props.activeCommunity) {
      this.props.dispatch(changeActiveChannel(''));
    }
  };

  clearActiveChannel = () => {
    this.props.dispatch(changeActiveThread(''));
    this.props.dispatch(changeActiveChannel(''));
  };

  handleOnClick = id => {
    this.clearActiveChannel();
    if (this.props.activeCommunity !== id) {
      this.changeCommunity(id);
    }
  };

  shouldComponentUpdate(nextProps) {
    const curr = this.props;

    const changedActiveCommunity =
      curr.activeCommunity !== nextProps.activeCommunity;
    const changedActiveChannel = curr.activeChannel !== nextProps.activeChannel;
    const changedCommunitiesAmount =
      curr.communities.length !== nextProps.communities.length;

    if (
      changedActiveCommunity ||
      changedActiveChannel ||
      changedCommunitiesAmount
    ) {
      return true;
    }
    return false;
  }

  render() {
    const { activeCommunity, activeChannel, communities } = this.props;
    const sortedCommunities = communities.slice().sort((a, b) => {
      const bc = parseInt(b.communityPermissions.reputation, 10);
      const ac = parseInt(a.communityPermissions.reputation, 10);

      // sort same-reputation communities alphabetically
      if (ac === bc) {
        return a.name.toUpperCase() <= b.name.toUpperCase() ? -1 : 1;
      }

      // otherwise sort by reputation
      return bc <= ac ? -1 : 1;
    });

    return (
      <CommunityListWrapper data-cy="inbox-community-list">
        <CommunityListScroller>
          <CommunityListItem
            data-cy="inbox-community-list-item"
            active={!activeCommunity}
            onClick={() => this.changeCommunity('')}
          >
            <Icon glyph={'everything'} />
            <CommunityListName>Everything</CommunityListName>
          </CommunityListItem>
          {sortedCommunities.map(c => (
            <ErrorBoundary fallbackComponent={null} key={c.id}>
              <CommunityListItem
                data-cy="inbox-community-list-item"
                onClick={() => this.handleOnClick(c.id)}
                active={c.id === activeCommunity}
              >
                <CommunityAvatarContainer>
                  <CommunityAvatar community={c} showHoverProfile={false} />
                </CommunityAvatarContainer>
                <CommunityListMeta>
                  <CommunityListName>{c.name}</CommunityListName>
                  <Reputation
                    ignoreClick
                    size={'mini'}
                    tipText={`Your rep in ${c.name}`}
                    reputation={c.communityPermissions.reputation}
                  />
                </CommunityListMeta>

                {c.id === activeCommunity && (
                  <ErrorBoundary>
                    <SidebarChannels
                      activeChannel={activeChannel}
                      communitySlug={c.slug}
                      permissions={c.communityPermissions}
                      slug={c.slug}
                      id={c.id}
                      setActiveChannelObject={this.props.setActiveChannelObject}
                    />
                  </ErrorBoundary>
                )}
              </CommunityListItem>
            </ErrorBoundary>
          ))}
        </CommunityListScroller>

        <Fixed>
          <Link
            to={'/explore'}
            onClick={() => events.INBOX_FIND_MORE_COMMUNITIES_CLICKED}
          >
            <CommunityListItem>
              <Icon glyph={'explore'} />
              <CommunityListName>Find more communities</CommunityListName>
            </CommunityListItem>
          </Link>
          {// if user has joined less than 5 communities, upsell some popular ones
          communities.length < 5 && (
            <ErrorBoundary fallbackComponent={null}>
              <UpsellExploreCommunities
                activeCommunity={activeCommunity}
                communities={communities}
                handleOnClick={this.handleOnClick}
                curatedContentType={'top-communities-by-members'}
              />
            </ErrorBoundary>
          )}
        </Fixed>
      </CommunityListWrapper>
    );
  }
}

export default compose(
  connect(),
  withRouter
)(CommunityList);
