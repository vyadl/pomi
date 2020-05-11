import { writable, derived } from 'svelte/store';
import { makeTwoDigitsCifer } from './../utils.js';

function createCounter() {
  const { subscribe, set, update } = writable(0);
  let timerId;

  return {
    subscribe,
    set: (number) => {
      clearInterval(timerId);
      set(number);
    },
    start: (startTime = +new Date) => {
      timerId = setInterval(() => {
        set(Math.floor((+new Date - startTime) / 1000));
      }, 1000);
    },
    finish: () => {
      set(0);
      clearInterval(timerId);
    },
    reset: () => {
      set(0);
    }
  };
}

export const extraCounter = createCounter();

extraCounter.set(0);

export const timerTime = derived(
  extraCounter,
  $extraCounter => {
    return {
      mins: Math.floor($extraCounter / 60),
      secs: $extraCounter % 60
    }
  }
);

export const extraCounterFormattedTime = derived(
  timerTime,
  $timerTime => {
    return {
      mins: makeTwoDigitsCifer($timerTime.mins),
      secs: makeTwoDigitsCifer($timerTime.secs)
    };
  }
);
