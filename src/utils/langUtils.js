import { get } from 'svelte/store';
import { dictionary } from 'svelte-i18n';
import { settings } from './../store/settings.js';
import { getDeepProperty } from './generalUtils.js';

export const _ = (key) => {
  const arrPath = key.split('.');

  return getDeepProperty(get(dictionary)[get(settings).language], arrPath) || key;
};
