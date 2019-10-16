// @flow
import { combineReducers } from 'redux';
import modals from './modals';
import toasts from './toasts';
import directMessageThreads from './directMessageThreads';
import gallery from './gallery';
import newUserOnboarding from './newUserOnboarding';
import newActivityIndicator from './newActivityIndicator';
import dashboardFeed from './dashboardFeed';
import threadSlider from './threadSlider';
import notifications from './notifications';
import message from './message';
import connectionStatus from './connectionStatus';

const getReducers = () => {
  return combineReducers({
    modals,
    toasts,
    directMessageThreads,
    gallery,
    newUserOnboarding,
    newActivityIndicator,
    dashboardFeed,
    threadSlider,
    notifications,
    connectionStatus,
    message,
  });
};

export default getReducers;
