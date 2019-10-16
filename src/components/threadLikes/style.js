// @flow
import theme from 'shared/theme';
import styled from 'styled-components';
import { Button } from 'src/components/buttons';

export const CurrentCount = styled.b`
  font-size: 13px;
`;

export const LikeButtonWrapper = styled(Button)`
  background: ${theme.bg.default};
  border: 1px solid ${theme.bg.border};
  color: ${props =>
    props.hasReacted ? props.theme.brand.alt : props.theme.text.alt};
  padding: 4px 0 4px 8px;
  display: flex;
  align-items: center;
  overflow: hidden;

  div + span {
    margin: 0;
    margin-left: 8px;
  }

  ${CurrentCount} {
    background: ${theme.bg.wash};
    border-left: 1px solid ${theme.bg.border};
    padding: 12px;
    margin-left: 12px;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    color: ${theme.text.secondary};
    font-size: 14px;
  }

  &:hover {
    background: ${theme.bg.default};
    color: ${props =>
      props.hasReacted ? props.theme.brand.alt : props.theme.text.default};
  }
`;

export const LikeCountWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 12px;
  color: ${props =>
    props.active ? props.theme.text.reverse : props.theme.text.alt};

  ${CurrentCount} {
    margin-left: 4px;
    font-weight: 600;
  }
`;
