import { writable, derived, get } from 'svelte/store';
import { stat } from './statistics.js';
import { extraCounter } from './extraCounter.js';
import { settings } from './settings.js';
import { currentActivityTitle } from './activities.js';
import { makeTwoDigitsCifer } from './../utils/generalUtils.js';
import { currentInterval, intervals, playAudio } from './intervals.js';
import { _ } from './../utils/langUtils.js';

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

          if (counter > 1) {
            return newCounter;
          }

          if (counter === 1 || counter === 0) {
            extraCounter.start();
          } else if (counter < 0) {
            extraCounter.start(+new Date - Math.abs(newCounter) * 1000);
          }

          playAudio(intervalId);

          stat.addStat(intervalId);
          clearInterval(timerId);
          handleNotification();
          
          return 0;
        });

      }, 1000);
    },
    finishPeriod: (intervalId) => {
      update(() => {
        clearInterval(timerId);
        stat.addStat(intervalId);
        currentInterval.set('');

        return 0;
      });
    },
    resetPeriod: () => {
      update(() => {
        clearInterval(timerId);

        currentInterval.set('');

        return 0;
      });
    },
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

function handleNotification() {
  if (get(settings).showNotifications) {
    const currentIntervalDuration = get(intervals)[get(currentInterval)].duration + _('minutes_short')
    const title = `${get(currentActivityTitle)} ${_('notifications.is_end')} (${currentIntervalDuration})`;

    new Notification(title, {
      icon: '/favicon.png',
      body: _('notifications.planned_period_ended'),
    });
  }
};
