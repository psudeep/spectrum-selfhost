// @flow
import theme from 'shared/theme';
import styled from 'styled-components';
import { Transition, HorizontalRule } from '../globals';

export const MessagesWrapper = styled.div`
  flex: 1 0 auto;
  padding-bottom: 8px;
  display: flex;
  flex-direction: column;
  max-width: 100%;

  @media (max-width: 768px) {
    padding-bottom: 16px;
  }
`;

export const MessageGroupContainer = styled.div`
  display: flex;
  flex: none;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  margin-top: 20px;
`;

export const Timestamp = styled(HorizontalRule)`
  margin: 20px 0 0;
  text-align: center;
  user-select: none;

  hr {
    border-color: ${theme.bg.wash};
  }
`;

export const UnseenRobotext = styled(Timestamp)`
  hr {
    border-color: ${theme.warn.alt};
    opacity: 0.1;
  }
`;

export const Time = styled.span`
  text-align: center;
  color: ${theme.text.placeholder};
  font-size: 14px;
  font-weight: 400;
  margin: 0 16px;
  transition: ${Transition.hover.off};

  &:hover {
    color: ${theme.text.alt};
    transiton: ${Transition.hover.on};
  }
`;

export const UnseenTime = styled(Time)`
  color: ${theme.warn.alt};

  &:hover {
    color: ${theme.warn.alt};
    transiton: ${Transition.hover.on};
  }
`;

export const MessageLink = styled.a`
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  white-space: nowrap;
  font-size: 12px;
  top: 0;
  color: ${theme.text.alt};
  left: calc(100% + 4px);
`;

export const MessageNonLink = MessageLink.withComponent('span');
