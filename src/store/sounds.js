import { readable, derived } from 'svelte/store';
import { soundsData } from './data/soundsData.js';

export const sounds = readable(soundsData);

export const soundsArr = derived(
  sounds,
  $sounds => {
    return Object.keys($sounds).reduce((result, current) => {
      result.push({
        id: current,
        title: $sounds[current].title,
      });

      return result;
    }, [])
  }
);
