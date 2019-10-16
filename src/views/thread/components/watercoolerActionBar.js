// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import Clipboard from 'react-clipboard.js';
import { addToastWithTimeout } from '../../../actions/toasts';
import Icon from '../../../components/icons';
import compose from 'recompose/compose';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';
import toggleThreadNotificationsMutation from 'shared/graphql/mutations/thread/toggleThreadNotifications';
import type { Dispatch } from 'redux';
import { LikeButton } from 'src/components/threadLikes';
import getThreadLink from 'src/helpers/get-thread-link';
import {
  FollowButton,
  ShareButtons,
  ShareButton,
  WatercoolerActionBarContainer,
} from '../style';

type Props = {
  thread: GetThreadType,
  currentUser: Object,
  dispatch: Dispatch<Object>,
  toggleThreadNotifications: Function,
};

type State = {
  notificationStateLoading: boolean,
};

class WatercoolerActionBar extends React.Component<Props, State> {
  state = { notificationStateLoading: false };

  toggleNotification = () => {
    const { thread, dispatch, toggleThreadNotifications } = this.props;
    const threadId = thread.id;

    this.setState({
      notificationStateLoading: true,
    });

    toggleThreadNotifications({
      threadId,
    })
      .then(({ data: { toggleThreadNotifications } }) => {
        this.setState({
          notificationStateLoading: false,
        });

        if (toggleThreadNotifications.receiveNotifications) {
          return dispatch(
            addToastWithTimeout('success', 'Notifications activated!')
          );
        } else {
          return dispatch(
            addToastWithTimeout('neutral', 'Notifications turned off')
          );
        }
      })
      .catch(err => {
        this.setState({
          notificationStateLoading: true,
        });
        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const { thread, currentUser } = this.props;
    const { notificationStateLoading } = this.state;

    return (
      <WatercoolerActionBarContainer>
        <div style={{ display: 'flex' }}>
          <LikeButton thread={thread} tipLocation={'bottom-right'} />

          {!thread.channel.isPrivate && (
            <ShareButtons>
              <ShareButton
                facebook
                tipText={'Share'}
                tipLocation={'top-left'}
                data-cy="thread-facebook-button"
              >
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?t=${encodeURIComponent(
                    thread.content.title
                  )}&u=https://${
                    process.env.REACT_APP_PROD_DOMAIN
                  }${getThreadLink(thread)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon glyph={'facebook'} size={24} />
                </a>
              </ShareButton>

              <ShareButton
                twitter
                tipText={'Tweet'}
                tipLocation={'top-left'}
                data-cy="thread-tweet-button"
              >
                <a
                  href={`https://twitter.com/share?text=${encodeURIComponent(
                    thread.content.title
                  )} on @vanila_io&url=https://${
                    process.env.REACT_APP_PROD_DOMAIN
                  }${getThreadLink(thread)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon glyph={'twitter'} size={24} />
                </a>
              </ShareButton>

              <Clipboard
                style={{ background: 'none' }}
                data-clipboard-text={`https://${
                  process.env.REACT_APP_PROD_DOMAIN
                }${getThreadLink(thread)}`}
                onSuccess={() =>
                  this.props.dispatch(
                    addToastWithTimeout('success', 'Copied to clipboard')
                  )
                }
              >
                <ShareButton
                  tipText={'Copy link'}
                  tipLocation={'top-left'}
                  data-cy="thread-copy-link-button"
                >
                  <a>
                    <Icon glyph={'link'} size={24} />
                  </a>
                </ShareButton>
              </Clipboard>
            </ShareButtons>
          )}
        </div>

        {currentUser && (
          <FollowButton
            currentUser={currentUser}
            icon={
              thread.receiveNotifications ? 'notification-fill' : 'notification'
            }
            tipText={
              thread.receiveNotifications
                ? 'Turn off notifications'
                : 'Get notified about replies'
            }
            tipLocation={'top-right'}
            loading={notificationStateLoading}
            onClick={this.toggleNotification}
            dataCy="thread-notifications-toggle"
          >
            {thread.receiveNotifications ? 'Subscribed' : 'Get notifications'}
          </FollowButton>
        )}
      </WatercoolerActionBarContainer>
    );
  }
}

export default compose(
  connect(),
  toggleThreadNotificationsMutation
)(WatercoolerActionBar);
