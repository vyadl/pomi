import { writable, get } from 'svelte/store';
import { updateFactor, intervals } from './intervals';
import {
  LOCAL_STORAGE_ACTIVITIES_KEY,
  LOCAL_STORAGE_CURRENT_ACTIVITY_ID_KEY,
  LOCAL_STORAGE_INTERVALS_KEY,
  LOCAL_STORAGE_ORDER_ACTIVITY_KEY,
  LOCAL_STORAGE_SETTINGS_KEY,
  LOCAL_STORAGE_STATISTICS_KEY,
} from './../localStorageConfig.js';

let isFirstSubscribe = true;
const defaultSettings = {
  isUserOnPage: true,
  // general interface
  showTimeInTitle: true,
  showTimeInFavicon: true,
  showLastSecondsColorful: true,
  showPlannedDuration: true,
  // behaviour
  showNotifications: false,
  remindAfterFinishActivity: false,
  minutesForReminding: 5,
  runNextTypeIntervalAfterFinishing: false,
  // language
  language: 'en',
  // theme
  theme: 'dark',
  // factor settings
  useActivityFactor: true,
  useCustomActivityFactor: false,
  customActivityFactor: 1,
  // main screen
  showMainTabs: true,
  showComment: true,
  showActivityNearTimer: true,
  showCurrentActivityOnMainScreen: true,
  showCurrentActivityLabelOnMainScreen: true,
  showCurrentPeriodAboveTimer: true,
  showDescriptionsForPeriods: true,
  showActivitiesAsCloud: true,
  activitySortType: 'name',
};

export const settings = writable(defaultSettings);

export const initSettings = function() {
  const localSettings = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY)
    ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY))
    : false;

  if (localSettings) {
    settings.set(localSettings);
  }

  initCheckingPresence();
};

function initCheckingPresence() {
  let isFirstTime = true;

  document.addEventListener('visibilitychange', () => {
    if (!isFirstTime) {
      changeSetting('isUserOnPage', !document.hidden);
    } else {
      isFirstTime = false;
    }
  });
}

export const localStorageUpdateSettings = function() {
  localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(get(settings)));
}

settings.subscribe(() => {
  if (isFirstSubscribe) {
    isFirstSubscribe = false;
    return false;
  }

  if (get(intervals)?.main?.duration) {
    updateFactor();
  }

  localStorageUpdateSettings();
});

export const changeSetting = function(setting, value, isBoolean = true) {
  settings.update(settings => {
    settings[setting] = isBoolean ? !!value : value;

    return {...settings};
  });

  localStorageUpdateSettings();
}

export const resetSettings = function(isReload = true) {
  localStorage.removeItem(LOCAL_STORAGE_SETTINGS_KEY);
  localStorage.removeItem(LOCAL_STORAGE_INTERVALS_KEY);

  if (isReload) {
    window.location.reload();
  }
}

export const resetHistory = function(isReload = true) {
  localStorage.removeItem(LOCAL_STORAGE_STATISTICS_KEY);

  if (isReload) {
    window.location.reload();
  }
}

export const resetActivities = function(isReload = true) {
  localStorage.removeItem(LOCAL_STORAGE_ACTIVITIES_KEY);
  localStorage.removeItem(LOCAL_STORAGE_CURRENT_ACTIVITY_ID_KEY);
  localStorage.removeItem(LOCAL_STORAGE_ORDER_ACTIVITY_KEY);

  if (isReload) {
    window.location.reload();
  }
}

export const resetAll = function() {
  localStorage.clear();

  window.location.reload();
}
