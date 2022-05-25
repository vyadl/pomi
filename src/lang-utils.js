import { dictionary } from 'svelte-i18n';
import { settings } from './store/settings.js';
import { get } from 'svelte/store';

export const _ = (key, options) => {
  const arrPath = key.split('.');

  return getDeepProperty(get(dictionary)[get(settings).language], arrPath);
};

export const getDeepProperty = (obj, arrPath) => {
  return arrPath.reduce((result, item) => {
    return result[item];
  }, obj);
};
