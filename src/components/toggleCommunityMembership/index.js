// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import addCommunityMemberMutation from 'shared/graphql/mutations/communityMember/addCommunityMember';
import removeCommunityMemberMutation from 'shared/graphql/mutations/communityMember/removeCommunityMember';
import type { GetCommunityType } from 'shared/graphql/queries/community/getCommunity';
import { addToastWithTimeout } from '../../actions/toasts';
import type { AddCommunityMemberType } from 'shared/graphql/mutations/communityMember/addCommunityMember';
import type { RemoveCommunityMemberType } from 'shared/graphql/mutations/communityMember/removeCommunityMember';
import type { Dispatch } from 'redux';
import { openModal } from 'src/actions/modals';

type Props = {
  community: {
    ...$Exact<GetCommunityType>,
  },
  removeCommunityMember: Function,
  addCommunityMember: Function,
  dispatch: Dispatch<Object>,
  render: Function,
  onJoin?: Function,
  onLeave?: Function,
};

type State = { isLoading: boolean };

class ToggleCommunityMembership extends React.Component<Props, State> {
  state = { isLoading: false };

  init = () => {
    const { community } = this.props;

    // warn team members before leaving a community they moderator
    if (community.communityPermissions.isModerator) {
      return this.props.dispatch(
        openModal('DELETE_DOUBLE_CHECK_MODAL', {
          id: community.id,
          entity: 'team-member-leaving-community',
          message:
            'You are a team member of this community. If you leave you will no longer be able to moderate this community.',
          buttonLabel: 'Leave Community',
        })
      );
    }

    // warn all other members before leaving
    if (community.communityPermissions.isMember) {
      return this.props.dispatch(
        openModal('DELETE_DOUBLE_CHECK_MODAL', {
          id: community.id,
          entity: 'team-member-leaving-community',
          buttonLabel: 'Leave Community',
          message:
            'Are you sure you want to leave this community? You will no longer see conversations in your feed or get updates about new activity.',
        })
      );
    }

    const action = community.communityPermissions.isMember
      ? this.removeMember
      : this.addMember;

    const input = { communityId: community.id };

    this.setState({
      isLoading: true,
    });

    return action(input);
  };

  terminate = () => {
    this.setState({
      isLoading: false,
    });
  };

  removeMember = input => {
    const { community } = this.props;
    return this.props
      .removeCommunityMember({ input })
      .then(({ data }: RemoveCommunityMemberType) => {
        this.props.dispatch(
          addToastWithTimeout('neutral', `Left ${community.name}.`)
        );

        this.props.onLeave && this.props.onLeave(data.removeCommunityMember);

        return this.terminate();
      })
      .catch(err => {
        this.props.dispatch(addToastWithTimeout('error', err.message));
        return this.terminate();
      });
  };

  addMember = input => {
    const { community } = this.props;
    return this.props
      .addCommunityMember({ input })
      .then(({ data }: AddCommunityMemberType) => {
        this.props.dispatch(
          addToastWithTimeout(
            'success',
            `Joined the ${community.name} community!`
          )
        );

        this.props.onJoin && this.props.onJoin(data.addCommunityMember);

        return this.terminate();
      })
      .catch(err => {
        this.props.dispatch(addToastWithTimeout('error', err.message));
        return this.terminate();
      });
  };

  render() {
    return (
      <div className={'member-button'} onClick={this.init}>
        {this.props.render(this.state)}
      </div>
    );
  }
}

export default compose(
  connect(),
  addCommunityMemberMutation,
  removeCommunityMemberMutation
)(ToggleCommunityMembership);
