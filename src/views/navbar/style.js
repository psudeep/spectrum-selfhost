// @flow
import theme from 'shared/theme';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { Transition, FlexRow, hexa, zIndex } from 'src/components/globals';
import { UserAvatar } from 'src/components/avatar';
import { isDesktopApp } from 'src/helpers/desktop-app-utils';

export const Nav = styled.nav`
  display: grid;
  grid-template-columns: repeat(4, auto) 1fr repeat(2, auto);
  grid-template-rows: 1fr;
  grid-template-areas: 'logo home messages explore . notifications profile';
  align-items: stretch;
  width: 100%;
  flex: 0 0 48px;
  padding: 0 16px;
  line-height: 1;
  box-shadow: 0 4px 8px ${({ theme }) => hexa(theme.bg.reverse, 0.15)};
  z-index: ${zIndex.navBar};
  ${isDesktopApp() &&
    css`
      -webkit-app-region: drag;
      user-select: none;
    `}
  background: ${({ theme }) =>
    process.env.NODE_ENV === 'production' ? theme.bg.reverse : theme.warn.alt};

  @media (max-width: 768px) {
    padding: 0;
    order: 3;
    position: relative;
    box-shadow: 0 -4px 8px ${({ theme }) => hexa(theme.bg.reverse, 0.15)};
    grid-template-columns: repeat(5, 20%);
    grid-template-areas: 'home messages explore notifications profile';
  }

  .hideOnMobile {
    @media (max-width: 768px) {
      display: none;
    }
  }

  .hideOnDesktop {
    @media (min-width: 769px) {
      display: none;
    }
  }

  ${props =>
    props.loggedOut &&
    css`
      grid-template-columns: repeat(3, auto) 1fr auto;
      grid-template-areas: 'logo explore support . signin';

      @media (max-width: 768px) {
        grid-template-columns: repeat(3, 1fr);
        grid-template-areas: 'home explore support';
      }
    `} ${props =>
  props.hideOnMobile &&
  css`
    @media (max-width: 768px) {
      display: none;
    }
  `};
`;

export const Label = styled.span`
  font-size: 14px;
  font-weight: ${isDesktopApp() ? '500' : '700'};
  margin-left: 12px;

  ${props =>
    props.hideOnDesktop &&
    css`
      display: none;
    `} @media (max-width: 768px) {
    font-size: 10px;
    font-weight: 700;
    margin: 0;
    display: inline-block;
  }

  @media (max-width: 360px) {
    display: none;
  }
`;

export const Tab = styled(Link)`
  display: grid;
  grid-template-columns: 'auto auto';
  grid-template-rows: 'auto';
  grid-template-areas: 'icon label';
  align-items: center;
  justify-items: center;
  padding: ${isDesktopApp() ? '0 12px' : '0 16px'};
  color: ${({ theme }) =>
    process.env.NODE_ENV === 'production'
      ? theme.text.placeholder
      : theme.warn.border};
  transition: ${Transition.hover.off};

  > div {
    grid-area: icon;
  }

  > ${Label} {
    grid-area: label;
  }

  @media (min-width: 768px) {
    &[data-active~='true'] {
      box-shadow: inset 0 ${isDesktopApp() ? '-2px' : '-4px'} 0
        ${theme.text.reverse};
      color: ${theme.text.reverse};
      transition: ${Transition.hover.on};

      &:hover,
      &:focus {
        box-shadow: inset 0 ${isDesktopApp() ? '-2px' : '-4px'} 0
          ${theme.text.reverse};
        transition: ${Transition.hover.on};
      }
    }

    &:hover,
    &:focus {
      box-shadow: inset 0 ${isDesktopApp() ? '-2px' : '-4px'} 0
        ${({ theme }) =>
          process.env.NODE_ENV === 'production'
            ? theme.text.placeholder
            : theme.warn.border};
      color: ${theme.text.reverse};
      transition: ${Transition.hover.on};
    }
  }

  @media (max-width: 768px) {
    color: ${props =>
      process.env.NODE_ENV === 'production'
        ? props.theme.text.placeholder
        : props.theme.warn.border};
    padding: 0;
    grid-template-columns: 'auto';
    grid-template-rows: 'auto auto';
    grid-template-areas: 'icon' 'label';
    align-content: center;

    &[data-active~='true'] {
      color: ${theme.text.reverse};
      transition: ${Transition.hover.on};
    }
  }
`;

export const DropTab = styled(FlexRow)`
  align-items: stretch;
  align-self: stretch;
  position: relative;
  flex: auto;
  flex: 0 1;

  &:hover {
    /*
      this padding left makes it so that there is a left zone on the
      icon that the user can mouseover without un-hovering the dropdown
     */
    ${props =>
      props.padOnHover &&
      css`
        @media (min-width: 768px) {
          color: ${theme.text.reverse};
          padding-left: 120px;
        }
      `};
  }

  @media (max-width: 768px) {
    flex: auto;
    justify-content: center;
    ${props =>
      props.hideOnMobile &&
      css`
        display: none;
      `};
  }

  .dropdown {
    display: none;
    pointer-events: none;
    position: absolute;
    top: 100%;
    right: 0;
    padding: 8px;

    @media (max-width: 768px) {
      display: none;
    }
  }

  &:hover .dropdown,
  .dropdown:hover {
    display: flex;
    pointer-events: auto;
    transition: ${Transition.hover.on};

    @media (max-width: 768px) {
      display: none;
    }
  }
`;

export const Reputation = styled.div`
  display: flex;
  grid-area: icon;
  align-items: center;
  padding-right: 16px;
  font-size: 14px;
  font-weight: 700;
`;

export const Logo = styled(Tab)`
  grid-area: logo;
  padding: ${isDesktopApp() ? '5px 32px 0 4px' : '0 24px 0 4px'};
  color: ${theme.text.reverse};
  opacity: 1;

  ${isDesktopApp() &&
    css`
      visibility: hidden;
    `} &:hover {
    box-shadow: none;
  }

  @media (max-width: 768px) {
    display: none;
  }

  ${props =>
    props.ishidden &&
    css`
      display: none;
    `};
`;

export const HomeTab = styled(Tab)`
  grid-area: home;
  ${isDesktopApp() &&
    css`
      -webkit-app-region: no-drag;
    `};
`;

export const MessageTab = styled(Tab)`
  grid-area: messages;
  ${isDesktopApp() &&
    css`
      -webkit-app-region: no-drag;
    `};
`;

export const ExploreTab = styled(Tab)`
  grid-area: explore;

  ${isDesktopApp() &&
    css`
      -webkit-app-region: no-drag;
    `};

  ${props =>
    props.loggedout &&
    css`
      grid-area: explore;
    `} ${Label} {
    @media (max-width: 768px) {
      display: flex;
    }

    @media (max-width: 360px) {
      display: none;
    }
  }
`;

export const SupportTab = styled(Tab)`
  grid-area: support;
`;

export const NotificationTab = styled(DropTab)`
  grid-area: notifications;

  ${isDesktopApp() &&
    css`
      -webkit-app-region: no-drag;
    `};

  > a {
    &:hover {
      box-shadow: none;
      transition: none;
    }
  }
`;

export const ProfileDrop = styled(DropTab)`
  grid-area: profile;

  ${isDesktopApp() &&
    css`
      -webkit-app-region: no-drag;
    `};

  > a {
    &:hover {
      box-shadow: none;
      transition: none;
    }
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const ProfileTab = styled(Tab)`
  grid-area: profile;
`;

export const Navatar = styled(UserAvatar)`
  margin-top: 0;
  border-radius: 100%;
  box-shadow: 0 0 0 2px ${theme.bg.default};
`;

export const LoggedOutSection = styled(FlexRow)`
  display: flex;
  flex: auto;
  justify-content: flex-end;

  @media (max-width: 768px) {
    flex: auto;
    justify-content: center;
    display: flex;
  }
`;

export const SigninLink = styled(Link)`
  grid-area: signin;
  font-weight: 700;
  font-size: 14px;
  color: ${({ theme }) =>
    process.env.NODE_ENV === 'production'
      ? theme.text.placeholder
      : theme.warn.border};
  align-self: center;
  padding: 10px;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const DropdownHeader = styled(FlexRow)`
  border-bottom: 2px solid ${theme.bg.wash};
  flex: 0 0 auto;
  align-self: stretch;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  font-weight: 500;
  font-size: 14px;
  color: ${theme.text.alt};

  a {
    display: flex;
    align-items: center;

    &:hover {
      color: ${theme.brand.alt};
    }
  }
`;

export const DropdownFooter = styled(FlexRow)`
  border-top: 2px solid ${theme.bg.wash};
  flex: 0 0 32px;
  align-self: stretch;
  justify-content: center;
  align-items: center;
  padding: 8px;

  button {
    display: flex;
    flex: 1;

    &:first-of-type:not(:last-of-type) {
      margin-right: 8px;
    }

    &:hover {
      color: ${theme.brand.alt};
      background: ${theme.bg.wash};
    }
  }
`;

export const Notification = styled.div`
  color: ${theme.text.default};
  padding: 8px;
  border-bottom: 1px solid ${theme.bg.border};
  overflow-x: hidden;
`;

export const MarkAllSeen = styled.span`
  color: ${props =>
    props.isActive ? props.theme.brand.alt : props.theme.text.alt};
  cursor: pointer;

  &:hover {
    color: ${props =>
      props.isActive ? props.theme.brand.default : props.theme.text.alt};
  }
`;

// We make it a real link element because anchor links don’t work properly with React Router.
// Ref: https://github.com/ReactTraining/react-router/issues/394.
export const SkipLink = Tab.withComponent('a').extend`
  grid-area: logo;
  overflow: hidden;
  height: 1px;
  width: 1px;

  &:focus {
    height: auto;
    width: auto;
  }
`;
