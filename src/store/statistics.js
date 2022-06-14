import { nanoid } from 'nanoid'
import { writable, derived, get } from 'svelte/store';
import { currentActivityId, currentActivityTitle, activities } from './activities.js';
import { comment } from './../store/counter.js';
import { intervals } from './intervals.js';
import { startTimestamp } from './counter.js';
import { addMessage } from './appNotifications.js';
import { _ } from './../utils/langUtils.js';
const MAXIMUM_TIME_FOR_ONE_ACTIVITY = 1000 * 60 * 60 * 24; // 24 hours

export const getDateString = (dateObj = new Date) => {
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
    addStat: (
      intervalId,
      startDate = new Date(get(startTimestamp)),
      endDate = new Date()
    ) => {
      update(stat => {
        const day = getDateString();
        const plannedDuration = get(intervals)[intervalId].duration;

        if (+endDate - +startDate > MAXIMUM_TIME_FOR_ONE_ACTIVITY) {
          endDate = new Date(+startDate + MAXIMUM_TIME_FOR_ONE_ACTIVITY);
          addMessage('tooBigActivity', _('validation.activity_more_than'), 10000);
        }

        const finalDuration = Math.ceil((+endDate - +startDate) / (1000 * 60));
        const isActivityInOneDay = endDate.getDate() === startDate.getDate();

        lastDay = day;

        if (isActivityInOneDay) {
          if (!stat[day]) {
            stat[day] = [];
          }

          stat[day].push({
            intervalId,
            startedAt: +startDate,
            finishedAt: +endDate,
            activityId: get(currentActivityId),
            activityTitle: get(currentActivityTitle),
            duration: finalDuration,
            plannedDuration,
            comment: get(comment),
            id: nanoid(),
          });
        } else {
          const firstDay = startDate;
          const firstDayStartedAt = +startDate;
          const nextDayFinishedAt = +endDate;
          const firstDayStr = getDateString(firstDay);
          const nextDayStr = getDateString(endDate);
          const firstDayFinishedAt = +firstDay.setHours(23, 59, 59, 999);
          const nextDayStartedAt = +endDate.setHours(0, 0, 0, 0);

          if (!stat[firstDayStr]) {
            stat[firstDayStr] = [];
          }
          if (!stat[nextDayStr]) {
            stat[nextDayStr] = [];
          }

          stat[firstDayStr].push({
            intervalId,
            startedAt: firstDayStartedAt,
            finishedAt: +firstDay.setHours(23, 59, 59, 999),
            activityId: get(currentActivityId),
            activityTitle: get(currentActivityTitle),
            duration: Math.ceil((firstDayFinishedAt - firstDayStartedAt) / (1000 * 60)),
            plannedDuration,
            comment: get(comment),
            id: nanoid(),
          });

          stat[nextDayStr].push({
            intervalId,
            startedAt: nextDayStartedAt,
            finishedAt: nextDayFinishedAt,
            activityId: get(currentActivityId),
            activityTitle: get(currentActivityTitle),
            duration: Math.ceil((nextDayFinishedAt - nextDayStartedAt) / (1000 * 60)),
            plannedDuration,
            comment: get(comment),
            id: nanoid(),
          });
        }

        return stat;
      });

      localStorageUpdateStat();
    },
    removeStat: (day, id) => {
      update(stat => {
        stat[day] = stat[day].filter(record => record.id !== id);

        return stat;
      });

      localStorageUpdateStat();
    },
    addTime: () => {
      const lastDayStat = get(stat)[lastDay];
      const lastRecordCopied = {...lastDayStat[lastDayStat.length - 1]};

      stat.removeStat(lastDay, lastRecordCopied.id);

      stat.addStat(
        lastRecordCopied.intervalId,
        new Date(lastRecordCopied.startedAt),
      );
    },
    addDay: (day) => {
      update(stat => {
        stat[day] = [];

        return stat;
      });

      localStorageUpdateStat();
    },
    removeDay: (day) => {
      update(stat => {
        delete stat[day];

        return stat;
      });

      localStorageUpdateStat();
    },
    changeRecord: (dayTitle, record, withUpdatingLocal = true) => {
      update(stat => {
        const recordIndex = stat[dayTitle].findIndex(item => item.id === record.id);

        stat[dayTitle][recordIndex] = {
          ...stat[dayTitle][recordIndex],
          ...record,
        };

        return stat;
      });

      if (withUpdatingLocal) {
        localStorageUpdateStat();
      }
    },
    addRecordManually: (dayTitle, record) => {
      update(stat => {
        stat[dayTitle].push({
          ...record,
          id: nanoid(),
        });

        return stat;
      });

      localStorageUpdateStat();
    }
  };
}

export const stat = createStat();

export const initStat = function() {
  const localStat = localStorage.getItem('stat');

  stat.update(() => (localStat ? JSON.parse(localStat) : {}));
};

export const localStorageUpdateStat = function() {
  localStorage.setItem('stat', JSON.stringify(get(stat)));
};


export const statArr = derived(stat, $stat => {
  return Object.keys($stat).reduce((result, day) => {
    result.push({
      title: day,
      list: $stat[day],
    });

    return result;
  }, []).sort((a, b) => {
    return parseInt(a.title.split('.').reverse().join(''))
      - parseInt(b.title.split('.').reverse().join(''));
  });
});

export const statByMonth = derived(statArr, $statArr => {
  return $statArr.reduce((result, day) => {
    const monthYear = day.title.slice(3);
    

    if (!result[monthYear]) {
      result[monthYear] = {
        title: monthYear,
        list: [],
      };
    } 

    result[monthYear].list.push(day);

    return result;
  }, {});
});

export const dayRanges = derived(stat, $stat => {
  return (dayTitle, excludeId = null) => {
    return $stat[dayTitle]?.reduce((result, record) => {
      if (excludeId && record.id === excludeId) {
        return result;
      }

      result.push([record.startedAt, record.finishedAt]);

      return result;
    }, []);
  };
});

export const activityDivider = writable(' - ');

export const statTotal = derived(statArr, $statArr => {
  return $statArr.reduce((result, day) => {
    result[day.title] = day.list.reduce((dayResult, record) => {
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
        const activityName = record.activityTitle;
        const activityParts = activityName.split(get(activityDivider));
        const isSubTask = activityParts.length > 1;

        if (dayResult.all[activityName]) {
          dayResult.all[activityName].quantity += 1;
          dayResult.all[activityName].totalTime = Math.round(dayResult.all[activityName].totalTime + +record.duration);
        } else {
          dayResult.all[activityName] = {
            quantity: 1,
            totalTime: record.duration
          };
        }

        if (isSubTask || dayResult.global[activityName]) {
          if (dayResult.global[activityParts[0]]) {
            dayResult.global[activityParts[0]].quantity += 1;
            dayResult.global[activityParts[0]].totalTime = Math.round(dayResult.global[activityParts[0]].totalTime + record.duration);
          } else {
            const wasGlobalTaskBefore = typeof dayResult.all[activityParts[0]] !== 'undefined';
            const quantity = wasGlobalTaskBefore
              ? dayResult.all[activityParts[0]].quantity + 1
              : 1;
            const totalTime = wasGlobalTaskBefore
              ? dayResult.all[activityParts[0]].totalTime + record.duration
              : record.duration;

            dayResult.global[activityParts[0]] = {
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


export const todayStat = derived(stat, $stat => {
  const lastDay = getDateString();

  return $stat[lastDay];
});

export const lastTime = derived(stat, $stat => {
  const lastDay = getDateString();

  return $stat[lastDay]?.[$stat[lastDay]?.length - 1];
});

export const changeActivityTitlesForDay = function(date) {
  get(stat)[date].forEach((record) => {
    if (get(activities)[record.activityId] && record.activityTitle !== get(activities)[record.activityId]) {
      stat.changeRecord(date, {
        id: record.id,
        activityTitle: get(activities)[record.activityId],
      }, false);
    }
  });
  
  localStorageUpdateStat();
}
