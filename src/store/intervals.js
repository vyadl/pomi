import { writable, derived, get } from 'svelte/store';
import { settings } from './../store/settings.js'
import { sounds } from './sounds.js';

let audios = {};

function createIntervals() {
  const { subscribe, update } = writable({});
  return {
    subscribe,
    update,
    changeIntervalProp(intervalId, prop, value) {
      update(intervals => {
        intervals[intervalId][prop] = value;

        localStorageUpdateIntervals(intervals);

        return intervals;
      });
    },
    changeSound: (intervalId, opts) => {
      update(intervals => {
        const newIntervals = JSON.parse(JSON.stringify(intervals));

        newIntervals[intervalId].sound = {
          ...newIntervals[intervalId].sound,
          ...opts,
        };

      if (typeof opts.id !== 'undefined') {
        audios[intervalId].src = `sounds/${get(sounds)[opts.id].fileName}`;
        audios[intervalId].load();
      } else if (typeof opts.volume !== 'undefined') {
        audios[intervalId].volume = +opts.volume;
      }

        localStorageUpdateIntervals(newIntervals);
        return newIntervals;
      });
    },
  };
};

export const intervals = createIntervals();
export const currentInterval = writable('');
export const activityFactor = writable('');
export const calculatedActivityFactor = writable('');
export const intervalsArr = derived(
  intervals,
  $intervals => Object.entries($intervals)
);
export const activeIntervals = derived(
  intervalsArr,
  $intervalsArr => $intervalsArr.filter(interval => interval[1].isActive)
);

export const initIntervals = function() {
  const localIntervals = localStorage.getItem('intervals');
  let defaultIdForSound;

  if (!localIntervals) {
    defaultIdForSound = Object.entries(get(sounds)).reduce((result, current) => {
      const fileName = 'monetka-na-stole.mp3';

      if (current[1].fileName === fileName) {
        result = current[0];
      }

      return result;
    }, 0);
  }

  intervals.update(() => localIntervals ? JSON.parse(localIntervals) : {
    main: {
      label: 'interval_labels.activity',
      duration: 25,
      title: '',
      isActive: 1,
      sound: {
        id: defaultIdForSound,
        volume: 0.3,
      },
    },
    break: {
      label: 'interval_labels.break',
      duration: 5,
      title: '',
      isActive: 1,
      sound: {
        id: defaultIdForSound,
        volume: 0.5,
      },
    },
    longBreak: {
      label: 'interval_labels.long_break',
      duration: 15,
      title: '',
      isActive: 1,
      sound: {
        id: defaultIdForSound,
        volume: 1,
      },
    },
  });

  updateFactor();

  ['main', 'break', 'longBreak'].forEach(intervalId => {
    audios[intervalId] = new Audio(`sounds/${get(sounds)[get(intervals)[intervalId].sound.id].fileName}`);
    audios[intervalId].volume = parseFloat(get(intervals)[intervalId].sound.volume);
    audios[intervalId].load();
  });

  localStorageUpdateIntervals(get(intervals));
};

export const updateFactor = () => {
  const { 
    useActivityFactor,
    useCustomActivityFactor,
    customActivityFactor,
  } = get(settings);

  calculatedActivityFactor.update(() => {
    const {
      main: { duration: a },
      break: { duration: b },
      longBreak: { duration: c },
    } = get(intervals);
    const factor = Math.round((a * 4 + b * 3 + c) / (a * 4) * 100) / 100;

    return factor;
  });

  activityFactor.update(() => {
    if (!useActivityFactor) {
      return 0;
    } else if (customActivityFactor && useCustomActivityFactor) {
      return customActivityFactor;
    } else {
      return get(calculatedActivityFactor);
    }
  });
}

export const localStorageUpdateIntervals = function(obj) {
  localStorage.setItem('intervals', JSON.stringify(obj));
};

// actions
export const playAudio = function(intervalId) {
  audios[intervalId].play();
};

export const stopAudio = function() {
  ['main', 'break', 'longBreak'].forEach(intervalId => {
    audios[intervalId].pause();
    audios[intervalId].currentTime = 0;
  });
}
