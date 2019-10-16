// @flow
import type { DBMessage } from 'shared/types';
import { db } from 'shared/db';

export const getMessageById = (messageId: string): Promise<DBMessage> => {
  return db
    .table('messages')
    .get(messageId)
    .run();
};
