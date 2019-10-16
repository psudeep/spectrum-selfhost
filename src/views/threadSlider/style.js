// @flow
import theme from 'shared/theme';
import styled, { css } from 'styled-components';
import { zIndex } from 'src/components/globals';

const animation = css`
  opacity: 0;
  transform: translateX(1em) translate3d(0, 0, 0);
  transition: opacity ${props => props.duration}ms ease-out,
    transform ${props => props.duration}ms ease-in-out;

  ${props =>
    props.entering || props.entered
      ? css`
          opacity: 1;
          transform: translateX(0em) translate3d(0, 0, 0);
        `
      : ''};
`;

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.15);
  z-index: ${zIndex.slider + 2};

  ${animation};
`;

export const Thread = styled.div`
  display: flex;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 650px;
  background: #fff;
  z-index: ${zIndex.slider + 3};
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.1);
  flex-direction: column;
  max-width: 100%;

  @media (max-width: 768px) {
    top: -48px;
    width: 100%;
  }

  @media (min-width: 768px) {
    ${animation};
  }
`;

export const Close = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  border-bottom: 1px solid ${theme.bg.border};
  padding: 8px 16px;
  flex: 1 0 auto;
  background: ${theme.bg.wash};
  max-height: 48px;
  justify-content: flex-end;
`;

export const CloseButton = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 32px;
  color: ${theme.text.alt};
`;

export const CloseLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${theme.text.alt};
`;
