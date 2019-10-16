// @flow
const { app } = require('electron');
const { resolve } = require('path');
require('now-env');

/**
 * Applications Configuration
 **/

module.exports = {
  APP_NAME: 'Spectrum',
  APP_VERSION: app.getVersion(),
  APP_REMOTE_URL: `https://${process.env.PROD_DOMAIN}/login`,
  APP_DEV_URL: 'http://spectrum.medimojo.co/login',
  APP_REMOTE_HOME_URL: `https://${process.env.PROD_DOMAIN}`,
  APP_DEV_HOME_URL: 'http://spectrum.medimojo.co',

  GITHUB_URL: 'https://github.com/withspectrum/spectrum',
  GITHUB_URL_LICENSE:
    'https://github.com/withspectrum/spectrum/blob/alpha/LICENSE',
  GITHUB_URL_ISSUES: 'https://github.com/withspectrum/spectrum/issues',

  WINDOW_DEFAULT_HEIGHT: 800,
  WINDOW_DEFAULT_WIDTH: 1300,
  WINDOW_MIN_HEIGHT: 500,
  WINDOW_MIN_WIDTH: 770,
  WINDOW_BG_COLOR: '#F5F8FC',

  ICON: resolve(__dirname, '../resources/icons/png/icon-512x512.png'),
};
