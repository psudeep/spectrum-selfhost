// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { openModal } from '../../../actions/modals';
import { Loading } from '../../../components/loading';
import { IconButton, Button } from '../../../components/buttons';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import ViewError from '../../../components/viewError';
import getCommunityChannels from 'shared/graphql/queries/community/getCommunityChannelConnection';
import type { GetCommunityChannelConnectionType } from 'shared/graphql/queries/community/getCommunityChannelConnection';
import type { Dispatch } from 'redux';
import { ListContainer } from '../style';
import {
  SectionCard,
  SectionTitle,
  SectionCardFooter,
} from '../../../components/settingsViews/style';
import { ChannelListItem } from 'src/components/listItems';

type Props = {
  data: {
    community: GetCommunityChannelConnectionType,
  },
  isLoading: boolean,
  dispatch: Dispatch<Object>,
  communitySlug: string,
};

class ChannelList extends React.Component<Props> {
  render() {
    const {
      data: { community },
      isLoading,
      dispatch,
    } = this.props;

    if (community) {
      const channels = community.channelConnection.edges.map(c => c && c.node);

      return (
        <SectionCard data-cy="channel-list">
          <SectionTitle>Channels</SectionTitle>

          <ListContainer style={{ padding: '0 16px' }}>
            {channels.length > 0 &&
              channels.map(channel => {
                if (!channel) return null;
                return (
                  <ChannelListItem key={channel.id} channel={channel}>
                    <Link
                      to={`/${channel.community.slug}/${channel.slug}/settings`}
                    >
                      <IconButton
                        tipText={'Settings'}
                        tipLocation={'top-left'}
                        glyph="settings"
                      />
                    </Link>
                  </ChannelListItem>
                );
              })}
          </ListContainer>

          <SectionCardFooter>
            <Button
              style={{ alignSelf: 'flex-start' }}
              icon={'plus'}
              onClick={() =>
                dispatch(
                  openModal('CREATE_CHANNEL_MODAL', {
                    community,
                    id: community.id,
                  })
                )
              }
              data-cy="create-channel-button"
            >
              Create Channel
            </Button>
          </SectionCardFooter>
        </SectionCard>
      );
    }

    if (isLoading) {
      return (
        <SectionCard>
          <Loading />
        </SectionCard>
      );
    }

    return (
      <SectionCard>
        <ViewError
          refresh
          small
          heading={'We couldn’t load the channels for this community.'}
        />
      </SectionCard>
    );
  }
}

export default compose(
  connect(),
  getCommunityChannels,
  viewNetworkHandler
)(ChannelList);
