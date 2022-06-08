import { writable, get } from 'svelte/store';
import { updateFactor, intervals } from './intervals';
let isFirstSubscribe = true;
const defaultSettings = {
  isUserOnPage: true,
  // shown in settings
  subtractTimeWhenFinishing: true,
  showPlannedDuration: true,
  showTimeInTitle: true,
  showTimeInFavicon: true,
  showLastSecondsColorful: true,
  language: 'en',
  useActivityFactor: true,
  useCustomActivityFactor: false,
  customActivityFactor: true,
  showActivityNearTimer: true,
  showNotifications: false,
  showMainTabs: true,
  showComment: true,
  showCurrentPeriodAboveTimer: false,
  showActivityInTopCorner: false,
  theme: 'dark',
  // main screen
  showCurrentActivityOnMainScreen: true,
  showCurrentActivityLabelOnMainScreen: true,
  showCurrentPeriodAboveTimer: true,
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

export const changeSetting = function(setting, value) {
  console.log(setting, value);
  settings.update(settings => {
    settings[setting] = !!value;

    return settings;
  });
}

export const resetAll = function() {
  localStorage.clear();

  window.location.reload();
}
