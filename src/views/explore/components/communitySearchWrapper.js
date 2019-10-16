// @flow
import theme from 'shared/theme';
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Transition, zIndex, Shadow, hexa } from '../../../components/globals';
import ViewSegment from '../../../components/themedSection';
import { Button } from '../../../components/buttons';
import { CLIENT_URL } from '../../../api/constants';
import { Tagline, Copy, Content } from '../../pages/style';
import { track, events } from 'src/helpers/analytics';

// $FlowFixMe
const CommunitySearchWrapper = props => {
  const ThisContent = styled(Content)`
    flex-direction: column;
    width: 640px;
    align-content: center;
    align-self: center;
    margin-top: 40px;
    margin-bottom: 0;
    padding: 16px;
    padding-bottom: 48px;

    @media (max-width: 640px) {
      margin-top: 80px;
      margin-bottom: 0;
      width: 100%;
    }
  `;

  const PrimaryCTA = styled(Button)`
    padding: 12px 16px;
    font-weight: 700;
    font-size: 14px;
    border-radius: 12px;
    background-color: ${theme.bg.default};
    background-image: none;
    color: ${theme.brand.alt};
    transition: ${Transition.hover.off};
    z-index: ${zIndex.card};

    &:hover {
      background-color: ${theme.bg.default};
      color: ${theme.brand.default};
      box-shadow: ${Shadow.high} ${props => hexa(props.theme.bg.reverse, 0.5)};
      transition: ${Transition.hover.on};
    }
  `;

  const SecondaryContent = styled(ThisContent)`
    margin-top: 0;
    margin-bottom: 0;
  `;

  const ThisTagline = styled(Tagline)`
    margin-bottom: 0;
  `;

  const SecondaryTagline = styled(ThisTagline)`
    font-size: 20px;
    font-weight: 900;
    margin-top: 0;
    margin-bottom: 2px;
  `;

  const ThisCopy = styled(Copy)`
    font-size: 16px;
    margin-bottom: 16px;
    font-weight: 500;
    text-align: center;
    max-width: 640px;

    @media (max-width: 768px) {
      text-align: left;
    }
  `;

  const SecondaryCopy = styled(ThisCopy)`
    margin-bottom: 16px;
  `;

  return (
    <ViewSegment goop={3} background="constellations">
      <ThisContent>
        <ThisTagline>Find a community for you!</ThisTagline>
        <ThisCopy>
          Try searching for topics like "crypto" or for products like "React"
        </ThisCopy>
        {props.children}
        <SecondaryContent>
          <SecondaryTagline>...or create your own community</SecondaryTagline>
          <SecondaryCopy>
            Building communities on Vanila Community is easy and free!
          </SecondaryCopy>
          {props.currentUser ? (
            <Link
              to={'/new/community'}
              onClick={() =>
                track(events.EXPLORE_PAGE_CREATE_COMMUNITY_CLICKED)
              }
            >
              <PrimaryCTA>Get Started</PrimaryCTA>
            </Link>
          ) : (
            <Link to={`/login?r=${CLIENT_URL}/new/community`}>
              <PrimaryCTA>Get Started</PrimaryCTA>
            </Link>
          )}
        </SecondaryContent>
      </ThisContent>
    </ViewSegment>
  );
};

export default CommunitySearchWrapper;
