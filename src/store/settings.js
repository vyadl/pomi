import { writable, get } from 'svelte/store';
import { updateFactor, intervals } from './intervals';
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
  showActivityInTopCorner: false,
  showActivityNearTimer: true,
  showCurrentActivityOnMainScreen: true,
  showCurrentActivityLabelOnMainScreen: true,
  showCurrentPeriodAboveTimer: true,
  showDescriptionsForPeriods: true,
};

export const settings = writable(defaultSettings);

export const initSettings = function() {
  const localSettings = localStorage.getItem('settings')
    ? JSON.parse(localStorage.getItem('settings'))
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
  localStorage.setItem('settings', JSON.stringify(get(settings)));
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

    return settings;
  });

  localStorageUpdateSettings();
}

export const resetSettings = function(isReload = true) {
  localStorage.removeItem('settings');
  localStorage.removeItem('intervals');

  if (isReload) {
    window.location.reload();
  }
}

export const resetHistory = function(isReload = true) {
  localStorage.removeItem('stat');

  if (isReload) {
    window.location.reload();
  }
}

export const resetActivities = function(isReload = true) {
  localStorage.removeItem('activities');
  localStorage.removeItem('currentActivityId');

  if (isReload) {
    window.location.reload();
  }
}

export const resetAll = function() {
  localStorage.clear();

  window.location.reload();
}
