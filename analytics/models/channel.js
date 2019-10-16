// @flow
import type { DBChannel } from 'shared/types';
import { db } from 'shared/db';

export const getChannelById = (channelId: string): Promise<DBChannel> => {
  return db
    .table('channels')
    .get(channelId)
    .run();
};
