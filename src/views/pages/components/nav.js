// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { Button, IconButton } from 'src/components/buttons';
import { Link } from 'react-router-dom';
import Icon from 'src/components/icons';
import { Logo } from 'src/components/logo';
import { UserAvatar } from 'src/components/avatar';
import Head from 'src/components/head';
import { withCurrentUser } from 'src/components/withCurrentUser';
import {
  NavContainer,
  Tabs,
  LogoTab,
  MenuTab,
  SupportTab,
  FeaturesTab,
  AuthTab,
  LogoLink,
  AuthLink,
  SupportLink,
  FeaturesLink,
  ExploreLink,
  MenuContainer,
  MenuOverlay,
} from '../style';
import { track, events } from 'src/helpers/analytics';

type Props = {
  currentUser: Object,
  location: Object,
  dark?: boolean,
};

type State = {
  menuIsOpen: boolean,
};

class Nav extends React.Component<Props, State> {
  state = { menuIsOpen: false };

  toggleMenu() {
    this.setState({ menuIsOpen: !this.state.menuIsOpen });
  }

  render() {
    return (
      <NavContainer data-cy="navbar-splash">
        <Head
          title={'Vanila Community - Hub for makers'}
          description={
            'Vanila Community is hub for Designers, Makers, Developers, Growth Hackers'
          }
        >
          <link
            rel="shortcut icon"
            id="dynamic-favicon"
            // $FlowIssue
            href={`${process.env.PUBLIC_URL}/img/favicon.ico`}
          />
        </Head>
        <Tabs>
          <LogoTab
            dark={this.props.dark}
            to="/about"
            data-cy="navbar-splash-about"
          >
            <Logo />
          </LogoTab>
          <FeaturesTab
            dark={this.props.dark}
            selected={this.props.location === 'features'}
            to="/"
            data-cy="navbar-splash-features"
          >
            Features
          </FeaturesTab>
          <SupportTab
            dark={this.props.dark}
            selected={this.props.location === 'support'}
            to="/support"
            data-cy="navbar-splash-support"
          >
            Support
          </SupportTab>
          <AuthTab dark={this.props.dark}>
            {this.props.currentUser ? (
              <Link to={'/'}>
                <UserAvatar
                  user={this.props.currentUser}
                  dataCy="navbar-splash-profile"
                />
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => track(events.HOME_PAGE_SIGN_IN_CLICKED)}
              >
                <Button
                  data-cy="navbar-splash-signin"
                  icon="welcome"
                  style={{
                    fontWeight: '700',
                    fontSize: '16px',
                    letterSpacing: '0.5px',
                    background: '#3D57FF',
                    color: '#ffffff',
                  }}
                >
                  Sign In
                </Button>
              </Link>
            )}
          </AuthTab>
          <MenuTab dark={this.props.dark} open={this.state.menuIsOpen}>
            <IconButton
              glyph={this.state.menuIsOpen ? 'view-close' : 'menu'}
              onClick={() => this.toggleMenu()}
            />
            <MenuContainer open={this.state.menuIsOpen}>
              <LogoLink to="/">
                <Logo />
              </LogoLink>
              <FeaturesLink
                to="/"
                selected={this.props.location === 'features'}
              >
                Features
              </FeaturesLink>

              <SupportLink
                to="/support"
                selected={this.props.location === 'support'}
              >
                Support
              </SupportLink>
              <ExploreLink
                to="/explore"
                selected={this.props.location === 'explore'}
              >
                Explore
              </ExploreLink>
              {this.props.currentUser ? (
                <AuthLink to={'/'}>
                  <span>Return home</span>
                </AuthLink>
              ) : (
                <AuthLink
                  to={'/login'}
                  onClick={() => track(events.HOME_PAGE_SIGN_IN_CLICKED)}
                >
                  <span>Log in or sign up</span>
                </AuthLink>
              )}
            </MenuContainer>
            <MenuOverlay
              onClick={() => this.toggleMenu()}
              open={this.state.menuIsOpen}
            />
          </MenuTab>
        </Tabs>
      </NavContainer>
    );
  }
}

export default compose(
  withCurrentUser,
  connect()
)(Nav);
