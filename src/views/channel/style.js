// @flow
import theme from 'shared/theme';
import styled from 'styled-components';
import Card from '../../components/card';
import { Transition, zIndex, Truncate } from '../../components/globals';
import { SegmentedControl } from '../../components/segmentedControl';
import { FullProfile, FullDescription } from 'src/components/profile/style';
import { ListContainer } from 'src/components/listItems/style';

export const Grid = styled.main`
  display: grid;
  grid-template-columns: minmax(320px, 1fr) 3fr minmax(240px, 2fr);
  grid-template-rows: 160px 1fr;
  grid-template-areas: 'cover cover cover' 'meta content extras';
  grid-column-gap: 32px;
  width: 100%;
  max-width: 1280px;
  min-height: 100vh;
  background-color: ${theme.bg.default};
  box-shadow: inset 1px 0 0 ${theme.bg.border},
    inset -1px 0 0 ${theme.bg.border};

  @media (max-width: 1280px) {
    grid-template-columns: 240px 1fr;
    grid-template-rows: 80px 1fr;
    grid-template-areas: 'cover cover' 'meta content';
  }

  @media (max-width: 768px) {
    grid-template-rows: 80px auto 1fr;
    grid-template-columns: 100%;
    grid-column-gap: 0;
    grid-row-gap: 16px;
    grid-template-areas: 'cover' 'meta' 'content';
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Meta = styled(Column)`
  grid-area: meta;

  > ${FullProfile} {
    margin-top: 16px;
    margin-bottom: 16px;
  }

  @media (max-width: 768px) {
    > ${FullProfile} {
      margin-top: 0;
      margin-bottom: 8px;
    }

    ${FullDescription} {
      display: none;
    }
  }

  ${ListContainer} {
    margin: 8px 0 0 32px;
    width: auto;

    @media (max-width: 768px) {
      margin-left: 0;
    }
  }

  > button,
  > a > button {
    margin-top: 16px;
    margin-left: 32px;
    width: calc(100% - 32px);

    @media (max-width: 768px) {
      margin-left: 0;
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    padding: 0 16px;

    > div {
      margin-left: 0;
    }
  }
`;
export const Content = styled(Column)`
  grid-area: content;
  min-width: 0;
  align-items: stretch;

  @media (max-width: 1280px) and (min-width: 768px) {
    padding-right: 32px;
  }

  @media (max-width: 768px) {
    > ${SegmentedControl} > div {
      margin-top: 0;
    }
  }
`;

export const Extras = styled(Column)`
  grid-area: extras;

  @media (max-width: 1280px) {
    display: none;
  }

  @media (min-width: 768px) {
    padding-right: 32px;
  }
`;

export const ColumnHeading = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  line-height: 1;
  font-weight: 500;
  padding: 8px 16px 12px;
  margin-top: 24px;
  border-bottom: 2px solid ${theme.bg.border};
`;

export const SearchContainer = styled(Card)`
  border-bottom: 2px solid ${theme.bg.border};
  position: relative;
  z-index: ${zIndex.search};
  width: 100%;
  display: block;
  min-height: 64px;
  transition: ${Transition.hover.off};

  &:hover {
    transition: none;
    border-bottom: 2px solid ${theme.brand.alt};
  }

  @media (max-width: 768px) {
    border-radius: 0;
    pointer-events: all;
    margin-bottom: 0;
  }
`;

export const SearchInput = styled.input`
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  padding: 20px;
  color: ${theme.text.default};
  transition: ${Transition.hover.off};
  font-size: 20px;
  font-weight: 800;
  margin-left: 8px;
  width: 97%;
  border-radius: 12px;
`;

export const MessageIconContainer = styled.div`
  color: ${theme.text.alt};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    color: ${theme.brand.alt};
  }
`;

export const UserListItemContainer = styled.div`
  border-bottom: 1px solid ${theme.bg.wash};
`;

export const CommunityContext = styled.div`
  display: flex;
  margin-top: 32px;
  margin-left: 32px;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    margin-top: 16px;
  }
`;

export const CommunityName = styled.h5`
  font-size: 18px;
  font-weight: 500;
  margin-left: 16px;
  color: ${theme.text.secondary};

  ${Truncate};
`;

export const ChannelName = styled.h3`
  font-size: 24px;
  font-weight: 600;
  margin-top: 24px;
  margin-bottom: 8px;
  margin-left: 32px;
  color: ${theme.text.default};

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

export const ChannelDescription = styled.h4`
  font-size: 18px;
  font-weight: 400;
  margin-left: 32px;
  margin-bottom: 16px;
  color: ${theme.text.alt};

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

export const MetadataContainer = styled.div`
  margin-left: 32px;

  @media (max-width: 768px;) {
    margin-left: 8px;
  }
`;
