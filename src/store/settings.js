import { writable, derived, get } from 'svelte/store';
let isFirstSubscribe = true;
const defaultSettings = {
  subtractTimeWhenFinishing: 1,
  showPlannedDuration: 1,
  showTimeInTitle: 1,
  showTimeInFavicon: 1,
  showLastSecondsColorful: 1,
  language: 'en'
};

export const settings = writable(defaultSettings);

export const initSettings = function() {
  const localSettings = localStorage.getItem('settings') ? JSON.parse(localStorage.getItem('settings')) : false;

  if (localSettings) {
    settings.set(localSettings);
  }
};

export const apiUpdateSettings = function() {
  const t = get(settings);

  localStorage.setItem('settings', JSON.stringify(get(settings)));
}

settings.subscribe(settings => {
  if (isFirstSubscribe) {
    isFirstSubscribe = false;
    return false;
  }

  apiUpdateSettings();
})
