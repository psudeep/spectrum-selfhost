// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Icon from 'src/components/icons';
import { Button } from 'src/components/buttons';
import getComposerLink from 'src/helpers/get-composer-link';
import { NullThreadFeed, NullHeading, OutlineButton, Hint } from '../style';

const EmptyThreadFeed = ({ dispatch, communityId, channelId }) => {
  const { pathname, search } = getComposerLink({ communityId, channelId });

  return (
    <NullThreadFeed data-cy="inbox-thread-feed">
      <NullHeading>
        Your feed's a little quiet right now, but don't worry...
      </NullHeading>
      <NullHeading>We've got recommendations!</NullHeading>
      <Hint>Kick your community off right!</Hint>
      {/* dispatch activethread to 'new'? */}
      <Link to={{ pathname, search, state: { modal: true } }}>
        <Button icon={'post'}>Post your first thread</Button>
      </Link>
      <Hint>Find new friends and great conversations!</Hint>
      <Link to={'/explore'}>
        <OutlineButton>
          <Icon glyph="explore" />
          <span>Join more communities</span>
        </OutlineButton>
      </Link>
    </NullThreadFeed>
  );
};

export default connect()(EmptyThreadFeed);
