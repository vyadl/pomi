import { writable, derived, get } from 'svelte/store';
import { stat } from './statistics.js';
import { settings } from './settings.js';
import { getMinutesSecondsObjFromSeconds } from './../utils/timeUtils.js';
import { currentInterval, intervals, playAudio, INTERVAL_LABELS } from './intervals.js';
import { currentActivityTitle } from './activities.js';
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
      let reminders = 0;

      currentInterval.set(intervalId);

      plannedFinishTimestamp.set(endTimestamp);
      startTimestamp.set(nowTimestamp);
      counter.set(0);

      counterId = setInterval(() => {
        update(() => {
          const nowTimestamp = +new Date();

          const newCounter = Math.floor((nowTimestamp - get(startTimestamp)) / 1000);

          if (nowTimestamp > endTimestamp) {
            if (isStatAdded) {
              if (get(settings).remindAfterFinishActivity) {
                const currentLimitInSeconds = get(settings).minutesForReminding * 60 * (reminders + 1);
                const isTimeToRemind = get(extraTimer) > currentLimitInSeconds;
                
                if (isTimeToRemind) {
                  reminders++;

                  playAudio(intervalId);
                  handleFinishPeriodNotification(true);
                }
              }
            } else {
              stat.addStat(intervalId);
              playAudio(intervalId);
              handleFinishPeriodNotification();
              isStatAdded = true;
            }
          }

          return newCounter;
        });
      }, 1000);
    },
    finishPeriod: (intervalId) => {
      stat.addStat(intervalId);
      counter.resetPeriod();
      counter.handleRunningNextPeriod(intervalId);
      playAudio(intervalId);
    },
    handleRunningNextPeriod: (intervalId) => {
      if (get(settings).runNextTypeIntervalAfterFinishing) {
        const nextInterval =
          [INTERVAL_LABELS.BREAK, INTERVAL_LABELS.LONG_BREAK].includes(intervalId)
            ? INTERVAL_LABELS.MAIN
            : INTERVAL_LABELS.BREAK;

        counter.start(nextInterval, get(intervals)[nextInterval].duration * 60);
      }
    },
    resetPeriod: () => {
      update(() => {
        clearInterval(counterId);
        currentInterval.set(null);
        startTimestamp.set(null);
        plannedFinishTimestamp.set(null);

        return 0;
      });
      
      comment.set('');
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

function handleFinishPeriodNotification(isReminder = false) {
  if (get(settings).showNotifications) {
    const currentIntervalDuration = get(intervals)[get(currentInterval)].duration + _('minutes_short')
    const title = `${get(currentActivityTitle)} ${_('notifications.is_end')}`;

    new Notification(title, {
      icon: '/favicon.png',
      body: isReminder
        ? `${
            get(currentActivityTitle)
          } ${
            _('notifications.reminder_about_finish')
          }: ${
            +get(extraTimerFormattedTime).mins
          }`
        : _('notifications.planned_period_ended'),
    });
  }
};
