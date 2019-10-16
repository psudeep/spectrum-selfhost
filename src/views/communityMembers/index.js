// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import type { GetCommunityType } from 'shared/graphql/queries/community/getCommunity';
import ViewError from 'src/components/viewError';
import { Button, OutlineButton, ButtonRow } from 'src/components/buttons';
import { CommunityInvitationForm } from 'src/components/emailInvitationForm';
import SlackConnection from '../communitySettings/components/slack';
import CommunityMembers from './components/communityMembers';
import JoinTokenSettings from './components/joinTokenSettings';
import type { Dispatch } from 'redux';
import { withCurrentUser } from 'src/components/withCurrentUser';
import {
  SectionsContainer,
  SectionCard,
  SectionTitle,
  Column,
} from 'src/components/settingsViews/style';
import { ErrorBoundary, SettingsFallback } from 'src/components/error';

type Props = {
  currentUser: Object,
  community: GetCommunityType,
  dispatch: Dispatch<Object>,
  match: Object,
  history: Object,
};

class CommunityMembersSettings extends React.Component<Props> {
  render() {
    const { community, history } = this.props;

    if (community && community.id) {
      return (
        <SectionsContainer>
          <Column>
            <ErrorBoundary fallbackComponent={SettingsFallback}>
              <CommunityMembers
                history={history}
                id={community.id}
                community={community}
              />
            </ErrorBoundary>
          </Column>

          <Column>
            <ErrorBoundary fallbackComponent={SettingsFallback}>
              <SlackConnection type={'import-only'} id={community.id} />
            </ErrorBoundary>

            {community.isPrivate && (
              <ErrorBoundary fallbackComponent={SettingsFallback}>
                <JoinTokenSettings id={community.id} community={community} />
              </ErrorBoundary>
            )}

            <ErrorBoundary fallbackComponent={SettingsFallback}>
              <SectionCard>
                <SectionTitle>Invite by email</SectionTitle>
                <CommunityInvitationForm id={community.id} />
              </SectionCard>
            </ErrorBoundary>
          </Column>
        </SectionsContainer>
      );
    }

    return (
      <ViewError
        heading={'You don’t have permission to manage this community.'}
        subheading={
          'If you want to create your own community, you can get started below.'
        }
      >
        <ButtonRow>
          <Link to={'/'}>
            <OutlineButton large>Take me back</OutlineButton>
          </Link>

          <Link to={'/new/community'}>
            <Button large>Create a community</Button>
          </Link>
        </ButtonRow>
      </ViewError>
    );
  }
}

export default compose(
  withCurrentUser,
  connect()
)(CommunityMembersSettings);
