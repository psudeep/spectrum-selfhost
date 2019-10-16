// @flow
// Shim some browser stuff we use in the client for server-side rendering
// NOTE(@mxstbr): We should be getting rid of this over time
require('now-env');
global.window = {
  location: {
    protocol: 'https:',
    host: `${process.env.PROD_DOMAIN}`,
    hash: '',
  },
  addEventListener: () => {},
};
global.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};
global.navigator = {
  userAgent: '',
};
global.CSS = {
  escape: require('css.escape'),
};
