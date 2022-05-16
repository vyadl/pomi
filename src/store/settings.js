import { writable, get } from 'svelte/store';
import { updateFactor, intervals } from './intervals';
let isFirstSubscribe = true;
const defaultSettings = {
  isUserOnPage: 1,
  // shown in settings
  subtractTimeWhenFinishing: 1,
  showPlannedDuration: 1,
  showTimeInTitle: 1,
  showTimeInFavicon: 1,
  showLastSecondsColorful: 1,
  language: 'en',
  useActivityFactor: 1,
  useCustomActivityFactor: 0,
  customActivityFactor: 1,
  showActivityNearTimer: 1,
  showNotifications: 0,
  showDetailsOnMainScreen: 1,
  showMainTabs: 1,
  showComment: 1,
  showCurrentPeriodAboveTimer: 0,
  showActivityInTopCorner: 0,
  // main screen
  showCurrentActivityOnMainScreen: 1,
  showCurrentActivityLabelOnMainScreen: 1,
  showCurrentPeriodAboveTimer: 1,
};

export const settings = writable(defaultSettings);

export const initSettings = function() {
  const localSettings = localStorage.getItem('settings') ? JSON.parse(localStorage.getItem('settings')) : false;

  if (localSettings) {
    settings.set(localSettings);
  }

  //initCheckingPresence();
};

function initCheckingPresence() {
  document.addEventListener('visibilitychange', () => {
    settings.update(settings => {
      settings.isUserOnPage = +!document.hidden;

      return settings;
    });
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
