import { writable, derived, get } from 'svelte/store';
import { currentTag } from './tags.js';
import { comment } from './../store/counter.js';
import { intervals, currentInterval } from './intervals.js';
import { settings } from './../store/settings.js';
import { startedAt } from './counter.js';
import { extraCounter } from './extraCounter.js';

function getDateString(dateObj = new Date) {
  return `${
    dateObj.getDate().toString().padStart(2, 0)
    }.${
    (dateObj.getMonth() + 1).toString().padStart(2, 0)
    }.${
    dateObj.getFullYear()
    }`;
};

function createStat() {
  const { subscribe, set, update } = writable({});
  let lastDay = '';

  return {
    subscribe,
    set,
    update,
    addStat: (intervalId, secondsToFinish = 0) => {
      update(stat => {
        const now = new Date();
        const day = getDateString();
        const plannedDuration = get(intervals)[intervalId].duration;
        const finalDuration = get(settings).subtractTimeWhenFinishing
          ? plannedDuration - Math.floor(secondsToFinish / 60)
          : plannedDuration;

        lastDay = day;

        if (!stat[day]) {
          stat[day] = [];
        }

        stat[day].push({
          intervalId,
          secondsToFinish,
          startedAt: get(startedAt),
          finishedAt: +now,
          tag: Object.entries(get(currentTag)),
          duration: finalDuration,
          plannedDuration,
          comment: get(comment),
        });

        apiUpdateStat(stat);
        return stat;
      });
    },
    addManualStat: ({
      day,
      intervalId,
      duration,
      comment = '',
      tag = Object.entries(get(currentTag)),
      startedAt = '',
      finishedAt = '',
    }) => {
      update(stat => {
        if (!stat[day]) {
          stat[day] = [];
        }

        stat[day].push({
          intervalId,
          tag,
          duration,
          comment,
          startedAt,
          finishedAt,
        });

        apiUpdateStat(stat);
        return stat;
      });
    },
    removeStat: (day, finishedAt) => {
      update(stat => {
        if (stat[day][stat[day].length - 1].finishedAt === finishedAt) {
          extraCounter.finish();
        }

        stat[day] = stat[day].filter(record => record.finishedAt !== finishedAt);
        apiUpdateStat(stat);

        return stat;
      });
    },
    addTime: (seconds, isNewBreak) => {
      extraCounter.finish();
      currentInterval.set('');
      if (isNewBreak) {
        const now = new Date;

        stat.addManualStat({
          day: getDateString(),
          intervalId: 'break',
          duration: Math.round(seconds / 60),
          startedAt: Math.round(+now - seconds * 1000),
          finishedAt: +now,
        });
      } else {
        update(stat => {
          const lastRecord = stat[lastDay][stat[lastDay].length - 1];

          lastRecord.duration += Math.round(seconds / 60);
          lastRecord.finishedAt = +(new Date());
          lastRecord.comment = get(comment);

          apiUpdateStat(stat);
          return stat;
        })
      }
    },
  };
}

export const stat = createStat();

export const initStat = function() {
  const localStat = localStorage.getItem('stat');

  stat.update(() => (localStat ? JSON.parse(localStat) : {}));
};

export const apiUpdateStat = function(obj) {
  localStorage.setItem('stat', JSON.stringify(obj));
};

export const statArr = derived(stat, $stat => {
  return Object.keys($stat).reduce((result, day) => {
    result.push({
      name: day,
      data: $stat[day],
    });

    return result;
  }, []).reverse();
});

export const tagDivider = writable(' - ');

export const statTotal = derived(statArr, $statArr => {
  return $statArr.reduce((result, day) => {
    result[day.name] = day.data.reduce((dayResult, record) => {
      if (!dayResult.all) {
        dayResult = {
          global: {},
          all: {},
          sum: {
            activities: 0,
            breaks: 0,
          },
        };
      }

      if (['break', 'longBreak'].includes(record.intervalId)) {
        dayResult.sum.breaks += +record.duration;
      } else {
        dayResult.sum.activities += +record.duration;
      }

      if (record.intervalId === 'main') {
        const tagName = record.tag[0][1];
        const tagParts = tagName.split(get(tagDivider));
        const isSubTask = tagParts.length > 1;

        if (dayResult.all[tagName]) {
          dayResult.all[tagName].quantity += 1;
          dayResult.all[tagName].totalTime = Math.round(dayResult.all[tagName].totalTime + record.duration);
        } else {
          dayResult.all[tagName] = {
            quantity: 1,
            totalTime: record.duration
          };
        }

        if (isSubTask || dayResult.global[tagName]) {
          if (dayResult.global[tagParts[0]]) {
            dayResult.global[tagParts[0]].quantity += 1;
            dayResult.global[tagParts[0]].totalTime = Math.round(dayResult.global[tagParts[0]].totalTime + record.duration);
          } else {
            const wasGlobalTaskBefore = typeof dayResult.all[tagParts[0]] !== 'undefined';
            const quantity = wasGlobalTaskBefore
              ? dayResult.all[tagParts[0]].quantity + 1
              : 1;
            const totalTime = wasGlobalTaskBefore
              ? dayResult.all[tagParts[0]].totalTime + record.duration
              : record.duration;

            dayResult.global[tagParts[0]] = {
              quantity,
              totalTime,
            };
          }
        }
      }

      return dayResult;
    }, {});

    return result;
  }, {});
});

export const makeHoursAndMinutes = (allMinutes) => {
  const hours = Math.floor(allMinutes / 60);
  const minutes = Math.floor(allMinutes % 60);

  return `${hours ? hours + (minutes ? ' hr, ' : '') : ''}${
    minutes ? minutes + ' min' : ''
  }`;
}

export const currentDayStat = derived(statTotal, $statTotal => {
  return $statTotal[getDateString()];
});
export const lastTime = derived(stat, $stat => {
  const lastDay = getDateString();

  return $stat[lastDay]?.[$stat[lastDay]?.length - 1];
});
