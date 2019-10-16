// @flow
// The constants for the GraphQL client on the web

export const IS_PROD =
  process.env.NODE_ENV === 'production' && !process.env.FORCE_DEV;
// In production the API is at the same URL, in development it's at a different port
export const API_URI = IS_PROD ? '/api' : 'http://spectrum.medimojo.co/api';
export const WS_URI = IS_PROD
  ? `wss://${window.location.host}/websocket`
  : 'ws://spectrum.medimojo.co/websocket';
