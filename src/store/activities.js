import { writable, derived, get } from 'svelte/store';

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

  activities.update(() => newActivities);
  localStorageUpdateActivities();
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
  localStorageUpdateCurrentActivityId();
};

export const initActivities = function() {
  const localActivities = localStorage.getItem('activities');
  const localCurrentActivityId = localStorage.getItem('currentActivityId');
  const idForDefault = getNewId();

  activities.update(() => localActivities ? JSON.parse(localActivities) : { [idForDefault]: 'default' });
  currentActivityId.update(() => localCurrentActivityId || idForDefault);

  localStorageUpdateActivities();
  localStorageUpdateCurrentActivityId();
};

export const localStorageUpdateActivities = function() {
  localStorage.setItem('activities', JSON.stringify(get(activities)));
};

export const localStorageUpdateCurrentActivityId = function() {
  localStorage.setItem('currentActivityId', get(currentActivityId));
};

function getNewId() {
  return String(+(new Date()));
}