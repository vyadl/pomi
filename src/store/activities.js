import { writable, derived, get } from 'svelte/store';
import { settings } from './settings.js';
import {
  LOCAL_STORAGE_ACTIVITIES_KEY,
  LOCAL_STORAGE_CURRENT_ACTIVITY_ID_KEY,
  LOCAL_STORAGE_ORDER_ACTIVITY_KEY,
} from './../localStorageConfig.js';

// stores

export const activities = writable({});
export const currentActivityId = writable('');
export const currentActivityTitle = derived(
  [currentActivityId, activities],
  ([currentActivityId, activities]) => {
    return activities[currentActivityId] || '';
});
export const activitiesArr = derived(
  activities,
  $activities => {
    return Object.keys($activities).sort((a, b) => {
      if ($activities[a] < $activities[b]) {
        return -1;
      }
      if ($activities[a] > $activities[b]) {
        return 1;
      }
      return 0;
    }).reduce((result, id) => {
      result.push({
        id,
        title: $activities[id]
      });

      return result;
    }, []);
  }
);
export const activityOptionsForSelect = derived(
  activitiesArr,
  $activitiesArr => {
    return $activitiesArr.map(item => ({ value: item.id, text: item.title }));
});
export const orderActivity = writable([]);
export const sortedActivitiesArr = derived(orderActivity,
  $orderActivity => get(settings).activitySortType === 'name'
    ? get(activitiesArr)
    : $orderActivity.map(id => ({
      id,
      title: get(activities)[id]
    }))
  );
export const makeActivityFirst = function (activityId) {
  if (get(activities)[activityId]) {
    let activityArr = [...get(orderActivity)];
    
    activityArr.unshift(activityId);
    activityArr = activityArr.filter((item, i) =>  i === 0 || item !== activityId);
    
    orderActivity.update(() => activityArr);
  }
}
export const addActivity = function(activityName) {
  const activitiesNames = Object.values(get(activities));
  const id = getNewId();

  if (!activitiesNames.includes(activityName)) {
    const newActivities = {
      ...get(activities),
      ...{
        [id]: activityName
      }
    };

    
    activities.update(() => newActivities);
    localStorageUpdateActivities();

    return { id, title: activityName };
  } else {
    return false;
  }
};
export const removeActivity = function(activityKey) {
  const resultArray = Object.keys(get(activities)).filter(key => key !== activityKey);
  const newActivities = resultArray.reduce((result, key) => {
    result[key] = get(activities)[key];

    return result;
  }, {});

  orderActivity.update($orderActivity => $orderActivity.filter(key => activityKey !== key));
  activities.update(() => newActivities);
  currentActivityId.update(() => '');

  localStorageUpdateActivities();
  localStorageUpdateActivityOrder();
  localStorageUpdateCurrentActivityId();
};

export const editActivity = function(activityId, activityTitle) {
  activities.update(activities => {
    if (activities[activityId]) {
      activities[activityId] = activityTitle;
    }

    return activities;
  });

  localStorageUpdateActivities();
}

export const setCurrentActivityId = function(id) {
  currentActivityId.update(() => id);
  makeActivityFirst(id);

  localStorageUpdateActivityOrder();
  localStorageUpdateCurrentActivityId();
};

export const initActivities = function() {
  const localActivities = localStorage.getItem(LOCAL_STORAGE_ACTIVITIES_KEY);
  const localCurrentActivityId = localStorage.getItem(LOCAL_STORAGE_CURRENT_ACTIVITY_ID_KEY);
  const localActivityOrder = localStorage.getItem(LOCAL_STORAGE_ORDER_ACTIVITY_KEY);
  const idForDefault = getNewId();

  activities.update(() => localActivities ? JSON.parse(localActivities) : { [idForDefault]: 'default' });
  currentActivityId.update(() => localCurrentActivityId || idForDefault);
  orderActivity.update(() => localActivityOrder
    ? JSON.parse(localActivityOrder)
    : get(activitiesArr).map(item => item.id)
  );

  if (!localActivityOrder && get(currentActivityId)) {
    makeActivityFirst(get(currentActivityId));
  }

  localStorageUpdateActivities();
  localStorageUpdateCurrentActivityId();
};

export const localStorageUpdateActivities = function() {
  localStorage.setItem(LOCAL_STORAGE_ACTIVITIES_KEY, JSON.stringify(get(activities)));
};

export const localStorageUpdateCurrentActivityId = function() {
  localStorage.setItem(LOCAL_STORAGE_CURRENT_ACTIVITY_ID_KEY, get(currentActivityId));
};

export const localStorageUpdateActivityOrder = function() {
  localStorage.setItem(LOCAL_STORAGE_ORDER_ACTIVITY_KEY, JSON.stringify(get(orderActivity)));
};

function getNewId() {
  return String(+(new Date()));
};
