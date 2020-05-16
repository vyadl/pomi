import { writable, derived, get } from 'svelte/store';

export const tags = writable({});
export const currentTag = writable({});
export const tagsArr = derived(
  tags,
  $tags => {
    return Object.keys($tags).sort((a, b) => {
      if ($tags[a] < $tags[b]) {
        return -1;
      }
      if ($tags[a] > $tags[b]) {
        return 1;
      }
      return 0;
    }).reduce((result, key) => {
      result.push({
        key,
        text: $tags[key]
      });

      return result;
    }, []);
  });

export const addTag = function(tagName) {
  const tagsNames = Object.values(get(tags));
  const tagskeys = Object.keys(get(tags));
  const key = +tagskeys[tagskeys.length - 1] + 1;

  if (!tagsNames.includes(tagName)) {
    const newTags = {
      ...get(tags),
      ...{
        [key]: tagName
      }
    };

    apiUpdateTags(newTags);
    tags.update(() => newTags);
  }
};

export const removeTag = function(tagKey) {
  const resultArray = Object.keys(get(tags)).filter(key => key !== tagKey);
  const newTags = resultArray.reduce((result, key) => {
    result[key] = get(tags)[key];

    return result;
  }, {});

  apiUpdateTags(newTags);
  tags.update(() => newTags);
};

export const setCurrentTag = function(tag) {
  apiUpdateCurrentTag(tag);
  currentTag.update(() => tag);
};

export const initTags = function() {
  const localTags = localStorage.getItem('tags');
  const localCurrentTag = localStorage.getItem('currentTag');

  tags.update(() => localTags ? JSON.parse(localTags) : { 1: 'default' });
  currentTag.update(() => localCurrentTag ? JSON.parse(localCurrentTag) : { 1: 'default' });
};

export const apiUpdateTags = function(tags) {
  localStorage.setItem('tags', JSON.stringify(tags));
};

export const apiUpdateCurrentTag = function(tag) {
  localStorage.setItem('currentTag', JSON.stringify(tag));
};