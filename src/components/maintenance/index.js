// @flow
import React from 'react';
import styled from 'styled-components';
import { FlexCol } from '../globals';
import { Tagline, Copy } from 'src/views/pages/style';
import ViewSegment from '../../components/themedSection';

const Emoji = styled.div`
  font-size: 3em;
  text-align: center;
  line-height: 1.5em;
  margin-bottom: 0.25em;
`;

const Wrapper = styled(FlexCol)`
  margin: 0 auto;
  text-align: center;
`;
const Text = styled(Copy)`
  font-size: 20px;
  line-height: 1.3;
  font-weight: 500;
  opacity: 0.95;
  margin: 0 auto;
  max-width: none;

  a {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    font-size: 20px;
    text-align: center;
  }
`;

const MaintenanceDowntime = () => {
  return (
    <ViewSegment background="constellations">
      <Wrapper>
        <Emoji>🛠</Emoji>
        <Tagline>Vanila Community is currently undergoing maintenance</Tagline>
        <Text>
          We'll be back soon, check{' '}
          <a href="https://twitter.com/vanila_io">@vanila_io on Twitter</a> for
          updates!
        </Text>
      </Wrapper>
    </ViewSegment>
  );
};

export default MaintenanceDowntime;
