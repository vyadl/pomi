import { writable, derived, get } from 'svelte/store';
import { stat } from './statistics.js';
import { extraCounter } from './../store/extraCounter.js';
import { makeTwoDigitsCifer } from './../utils.js';
import { currentInterval, playAudio, setMute } from './intervals.js';

function createCounter() {
  const { subscribe, set, update } = writable(0);
  let timerId;

  return {
    subscribe,
    set: (number) => {
      clearInterval(timerId);
      set(number);
    },
    start: (intervalId) => {
      const start = +new Date;
      const endTime = +new Date(start + get(counter) * 1000);

      extraCounter.finish();
      startedAt.set(start);
      comment.set('');

      timerId = setInterval(() => {
        
        update(counter => {
          const newCounter = Math.ceil((endTime - +new Date) / 1000);

          if (counter > 0) {
            return newCounter;
          } else {
            if (counter < 0) {
              extraCounter.start(+new Date - Math.abs(newCounter) * 1000);
              counter = 0;
            } else {
              extraCounter.start();
            }

            playAudio(intervalId);
            stat.addStat(intervalId, counter);
            clearInterval(timerId);

            return counter;
          }
        });

      }, 1000);
    },
    finishPeriod: (intervalId) => {
      update(counter => {
        clearInterval(timerId);

        playAudio(intervalId);
        stat.addStat(intervalId, counter);
        currentInterval.set('');

        return 0;
      });
    },
    mute: () => {
      setMute(true);
    },
    unmute: () => {
      setMute(false);
    }
  };
}

export const startedAt = writable(0);
export const comment = writable('');
export const counter = createCounter();
export const timerTime = derived(
  counter,
  $counter => {
    return {
      mins: Math.floor($counter / 60),
      secs: $counter % 60
    }
  }
)

export const timerFormattedTime = derived(
  timerTime,
  $timerTime => {
    return {
      mins: makeTwoDigitsCifer($timerTime.mins),
      secs: makeTwoDigitsCifer($timerTime.secs)
    };
  }
);
