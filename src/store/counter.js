import { writable, derived, get } from 'svelte/store';
import { stat } from './statistics.js';
import { settings } from './settings.js';
import { makeTwoDigitsCifer } from './../utils/generalUtils.js';
import { getMinutesSecondsObjFromSeconds } from './../utils/timeUtils.js';
import { currentInterval, intervals, playAudio } from './intervals.js';
import { _ } from './../utils/langUtils.js';

function createCounter() {
  const { subscribe, set, update } = writable(0);
  let counterId;

  return {
    subscribe,
    set: (number) => {
      clearInterval(counterId);
      set(number);
    },
    start: (intervalId, durationInSeconds) => {
      const nowTimestamp = +new Date();
      const endTimestamp = +new Date(nowTimestamp + durationInSeconds * 1000);
      let isStatAdded = false;

      plannedFinishTimestamp.set(endTimestamp);
      startTimestamp.set(nowTimestamp);
      counter.set(0);

      counterId = setInterval(() => {
        update(() => {
          const nowTimestamp = +new Date();

          const newCounter = Math.floor((nowTimestamp - get(startTimestamp)) / 1000);

          if (!isStatAdded && nowTimestamp > endTimestamp) {
            stat.addStat(intervalId);
            playAudio(intervalId);
            handleFinishPeriodNotification();
            isStatAdded = true;
          }

          return newCounter;
        });
      }, 1000);
    },
    finishPeriod: (intervalId) => {
      stat.addStat(intervalId);
      counter.resetPeriod();
      playAudio(intervalId);
    },
    resetPeriod: () => {
      update(() => {
        clearInterval(counterId);
        currentInterval.set(null);
        startTimestamp.set(null);
        plannedFinishTimestamp.set(null);

        return 0;
      });
    },
  };
}

export const plannedFinishTimestamp = writable(0);
export const startTimestamp = writable(0);
export const comment = writable('');
export const counter = createCounter();

export const timer = derived(
  [counter, plannedFinishTimestamp, startTimestamp],
  ([$counter, $plannedFinishTimestamp, $startTimestamp]) => {
    return $plannedFinishTimestamp && $startTimestamp
      ? Math.floor(($plannedFinishTimestamp - ($startTimestamp + $counter * 1000)) / 1000)
      : 0;
  }
);

export const extraTimer = derived(
  timer,
  $timer => {
    return $timer >= 0 ? 0 : -$timer;
  }
);

export const counterFormattedTime = derived(
  counter,
  $counter => {
    return getMinutesSecondsObjFromSeconds($counter);
  }
)

export const timerFormattedTime = derived(
  timer,
  $timer => {
    return getMinutesSecondsObjFromSeconds($timer);
  }
);

export const extraTimerFormattedTime = derived(
  extraTimer,
  $extraTimer => {
    return getMinutesSecondsObjFromSeconds($extraTimer);
  }
);

function handleFinishPeriodNotification() {
  if (get(settings).showNotifications) {
    const currentIntervalDuration = get(intervals)[get(currentInterval)].duration + _('minutes_short')
    const title = `${get(currentActivityTitle)} ${_('notifications.is_end')} (${currentIntervalDuration})`;

    new Notification(title, {
      icon: '/favicon.png',
      body: _('notifications.planned_period_ended'),
    });
  }
};
