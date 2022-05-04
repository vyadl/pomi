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
};

export const settings = writable(defaultSettings);

export const initSettings = function() {
  const localSettings = localStorage.getItem('settings') ? JSON.parse(localStorage.getItem('settings')) : false;

  if (localSettings) {
    settings.set(localSettings);
  }

  initCheckingPresence();
};

function initCheckingPresence() {
  document.addEventListener('visibilitychange', () => {
    settings.update(settings => ({
      ...settings,
      isUserOnPage: +document.hidden,
    }));
  });
}

export const apiUpdateSettings = function() {
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

  apiUpdateSettings();
})
