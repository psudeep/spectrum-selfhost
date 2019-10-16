// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/icons';
import { LoadingDM } from '../../../components/loading';
import { View, MessagesList, ComposeHeader } from '../style';

export default () => (
  <View>
    <MessagesList>
      <Link to="/messages/new">
        <ComposeHeader>
          <Icon glyph="message-new" />
        </ComposeHeader>
      </Link>
      <div>
        <LoadingDM />
        <LoadingDM />
        <LoadingDM />
        <LoadingDM />
        <LoadingDM />
        <LoadingDM />
        <LoadingDM />
        <LoadingDM />
        <LoadingDM />
        <LoadingDM />
        <LoadingDM />
      </div>
    </MessagesList>
  </View>
);
