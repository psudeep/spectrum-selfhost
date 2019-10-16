// @flow
import * as React from 'react';
import PageFooter from '../components/footer';
import Section from 'src/components/themedSection';
import { Wrapper } from '../style';
import { Link } from 'react-router-dom';
import { Button } from 'src/components/buttons';
import {
  FourUp,
  Heading,
  Copy,
  PlanSection,
  PlanPrice,
  PlanDescription,
} from '../pricing/style';
import { track, events } from 'src/helpers/analytics';
import Head from 'src/components/head';

class Support extends React.Component<{}> {
  componentDidMount() {
    track(events.SUPPORT_PAGE_VIEWED);
  }

  render() {
    return (
      <Wrapper data-cy="support-page">
        <Head
          title={'Vanila Community · Support'}
          description={'Questions, feedback, or just need to get in touch?'}
        />

        <Section goop={2} color={'bg.reverse'}>
          <FourUp>
            <div style={{ gridArea: 'copy' }}>
              <Heading>What can we help you with?</Heading>

              <Copy>
                Questions, feedback, or just need to get in touch? You’ve come
                to the right place.
              </Copy>
            </div>
            <PlanSection style={{ gridArea: 'one' }}>
              <div>
                <PlanPrice>Found an issue?</PlanPrice>
                <PlanDescription>
                  Join our Hugs n Bugs channel to check if there’s already a fix
                  or report a new issue.
                </PlanDescription>
              </div>

              <Link to={'/vanila/hugs-n-bugs'}>
                <Button
                  gradientTheme={'warn'}
                  icon={'bug'}
                  onClick={() => track(events.SUPPORT_PAGE_REPORT_BUG)}
                >
                  Join Hugs-n-Bugs
                </Button>
              </Link>
            </PlanSection>

            <PlanSection style={{ gridArea: 'two' }}>
              <div>
                <PlanPrice>Looking for a feature?</PlanPrice>
                <PlanDescription>
                  Jump into our Feature Requests channel and tell us what you
                  want or add onto existing requests from others.
                </PlanDescription>
              </div>

              <Link to={'/vanila/feature-requests'}>
                <Button
                  gradientTheme={'space'}
                  icon={'idea'}
                  onClick={() => track(events.SUPPORT_PAGE_REQUEST_FEATURE)}
                >
                  Request a feature
                </Button>
              </Link>
            </PlanSection>

            <PlanSection style={{ gridArea: 'three' }}>
              <div>
                <PlanPrice>What we’ve been working on</PlanPrice>
                <PlanDescription>
                  We post news, release notes, and threads from all over Vanila
                  Community on Twitter, or directly in our community.
                </PlanDescription>
              </div>

              <a
                href={'https://twitter.com/vanila_io'}
                target={'_blank'}
                rel={'noopener noreferrer'}
              >
                <Button
                  gradientTheme={'social.twitter'}
                  icon={'twitter'}
                  onClick={() => track(events.SUPPORT_PAGE_FOLLOW_ON_TWITTER)}
                >
                  Follow us on Twitter
                </Button>
              </a>

              <Link to={'/vanila'}>
                <Button
                  gradientTheme={'brand'}
                  icon={'logo'}
                  onClick={() =>
                    track(events.SUPPORT_PAGE_JOIN_SPECTRUM_COMMUNITY)
                  }
                >
                  Join our community
                </Button>
              </Link>
            </PlanSection>

            <PlanSection style={{ gridArea: 'four' }}>
              <div>
                <PlanPrice>Anything else?</PlanPrice>
                <PlanDescription>
                  Concerned about something on Vanila Community? Shoot us an
                  email and we’ll take care of it right away.
                </PlanDescription>
              </div>

              <a href={'mailto:community@vanila.io'}>
                <Button
                  gradientTheme={'special'}
                  icon={'email'}
                  onClick={() => track(events.SUPPORT_PAGE_EMAIL_US)}
                >
                  Email us
                </Button>
              </a>
            </PlanSection>
          </FourUp>
        </Section>

        <PageFooter />
      </Wrapper>
    );
  }
}
export default Support;
