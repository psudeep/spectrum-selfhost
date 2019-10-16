import React from 'react';
import styled, { css } from 'styled-components';
import theme from 'shared/theme';
import Icon from '../icons';
import { hexa, Shadow, FlexRow, FlexCol, zIndex } from '../globals';

export const DropzoneWrapper = styled.div`
  position: sticky;
  height: 100%;
  top: 0;
  right: 0;
  left: 0;
  bottom 0;
`;

export const DropImageOverlay = (props: { visible: boolean }) => {
  return (
    <DropImageOverlayWrapper visible={props.visible}>
      <Icon glyph="photo" />
      <h3>Drop image to upload</h3>
    </DropImageOverlayWrapper>
  );
};

export const Wrapper = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  bottom: 0;
`;

export const DropImageOverlayWrapper = styled.div`
  position: absolute;
  top: -32px;
  bottom: 0;
  left: -32px;
  right: -32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: ${theme.bg.wash};
  border-radius: 4px;
  border: 1px solid ${theme.bg.border};
  color: ${theme.text.secondary};
  transition: opacity 125ms ease-in-out;

  ${props =>
    props.visible
      ? css`
          opacity: 0.9;
        `
      : css`
          opacity: 0;
          pointer-events: none;
        `}
`;

export const Overlay = styled.div`
  ${props =>
    props.slider &&
    css`
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      z-index: 3000;
      background: #000;
      pointer-events: auto;
      opacity: 0.4;
    `}
`;

export const Container = styled(FlexCol)`
  background-color: ${theme.bg.default};
  display: grid;
  grid-template-rows: 50px 1fr 64px;
  grid-template-columns: 100%;
  grid-template-areas: 'header' 'body' 'footer';
  align-self: stretch;
  flex: auto;
  overflow: hidden;
  height: 100vh;
  position: relative;
  z-index: ${zIndex.composer};

  ${props =>
    props.slider &&
    css`
      right: 0;
      position: absolute;
      width: 650px;
      top: 0;
      height: 100vh;
    `}

  @media (max-width: 768px) {
    grid-template-rows: 48px 64px 1fr 64px;
    grid-template-areas: 'title' 'header' 'body' 'footer';
    max-width: 100vw;
    width: 100%;
    height: 100vh;
  }
`;

export const DesktopLink = styled.a`
  display: flex;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const ButtonRow = styled(FlexRow)`
  @media (max-width: 768px) {
    justify-content: flex-end;
  }
`;

export const Actions = styled(FlexCol)`
  background: ${theme.bg.wash};
  border-top: 2px solid ${theme.bg.border};
  padding: 8px 16px;
  border-radius: 0;
  align-self: stretch;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: relative;
  grid-area: footer;

  @media (max-width: 768px) {
    padding: 8px;
    z-index: ${zIndex.chrome + 1};
    border-radius: 0;
    border: 0;
    background: ${theme.bg.wash};
    border-top: 1px solid ${theme.bg.border};

    > ${ButtonRow} {
      width: 100%;

      > button:first-of-type {
        display: none;
      }

      > button:last-of-type {
        width: calc(100% - 16px);
        margin-right: 8px;
      }
    }
  }
`;

export const InputHints = styled(FlexRow)`
  color: ${theme.text.alt};
  font-size: 14px;
`;

export const Dropdowns = styled(FlexRow)`
  display: flex;
  align-items: center;
  grid-area: header;
  background-color: ${theme.bg.wash};
  box-shadow: ${Shadow.low} ${props => hexa(props.theme.bg.reverse, 0.15)};
  z-index: 9999;
  grid-area: header;
  border-bottom: 1px solid ${theme.bg.border};

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

export const DropdownsLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${theme.text.secondary};
  margin-left: 16px;
  line-height: 1;
  vertical-align: middle;
  position: relative;
  top: 1px;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const CommunityPreview = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${theme.text.secondary};
  margin-left: 16px;
  line-height: 1.2;
  display: flex;
  align-items: center;
  position: relative;
`;

export const ChannelPreview = styled(CommunityPreview)`
  margin-left: 0;
`;

const Selector = styled.select`
  max-width: 196px;
  display: inline-block;
  flex: none;
  border: none;
  box-shadow: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  cursor: pointer;
  margin-left: 8px;
  box-sizing: border-box;
  font-weight: 500;
  font-size: 14px;

  @media (max-width: 768px) {
    flex: auto;
    max-width: calc(50% - 12px);
  }
`;

export const RequiredSelector = styled(Selector)`
  padding: 8px 12px;
  max-height: 38px;
  display: flex;
  align-items: center;
  line-height: 1.2;
  border: 2px solid
    ${props => (props.emphasize ? theme.brand.alt : theme.bg.border)};
  border-radius: 8px;
  color: ${props => (props.emphasize ? theme.brand.alt : theme.text.default)};
  background-color: ${props =>
    props.disabled ? theme.bg.wash : theme.bg.default};
`;

export const OptionalSelector = styled(Selector)`
  color: ${theme.text.alt};
  margin-left: 16px;
  background-color: transparent;
`;

export const ThreadInputs = styled(FlexCol)`
  position: relative;
  padding: 32px;
  padding-bottom: 0;
  background-color: ${theme.bg.default};
  z-index: ${zIndex.composer};
  height: 100%;

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

export const ThreadTitle = {
  fontSize: '28px',
  padding: '0',
  outline: 'none',
  border: '0',
  lineHeight: '1.3',
  fontWeight: '600',
  boxShadow: 'none',
  width: '100%',
  color: '#16171A',
  whiteSpace: 'pre-wrap',
  minHeight: '34px',
  flex: 'none',
  display: 'inline-block',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Helvetica', 'Segoe', sans-serif",
};

export const ThreadDescription = {
  fontSize: '16px',
  fontWeight: '400',
  width: '100%',
  display: 'inline-block',
  lineHeight: '1.4',
  outline: 'none',
  border: '0',
  boxShadow: 'none',
  color: '#16171A',
  whiteSpace: 'pre-wrap',
  overflowY: 'scroll',
  position: 'relative',
  // NOTE(@mxstbr): Magic value to make the margin between
  // the thread title and body match the preview
  marginTop: '12px',
};

export const DisabledWarning = styled.div`
  display: flex;
  flex: auto;
  justify-content: center;
  align-items: center;
  padding: 8px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  background: ${props => hexa(props.theme.warn.default, 0.1)};
  color: ${theme.warn.default};
`;

export const RenderWrapper = styled.div``;

export const InputsGrid = styled.div`
  display: grid;
  grid-template-rows: 48px 1fr;
  grid-area: body;
  overflow: hidden;
  overflow-y: scroll;

  ${props =>
    props.isEditing &&
    css`
      height: 100%;
    `}
`;
