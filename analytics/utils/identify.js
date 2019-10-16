// @flow
const debug = require('debug')('analytics:identify');
import Raven from 'shared/raven';
import { amplitude } from './amplitude';
import { hash } from './';

export const identify = (userId: string, userProperties: Object) => {
  const amplitudePromise = () => {
    debug(`[Amplitude] Identify ${userId}`);
    return amplitude.identify({
      userId: hash(userId),
      userProperties,
    });
  };

  return Promise.all([amplitudePromise()]).catch(err => {
    console.error('❌ Error in job:\n');
    console.error(err);
    Raven.captureException(err);
  });
};
