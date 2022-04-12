import { writable, derived, get } from 'svelte/store';
import { settings } from './../store/settings.js'
import { sounds } from './sounds.js';

let audios = {};

function createIntervals() {
  const { subscribe, update } = writable({});
  return {
    subscribe,
    update,
    changeDuration: (intervalId, duration) => {
      update(intervals => {
        const newIntervals = JSON.parse(JSON.stringify(intervals));

        newIntervals[intervalId].duration = duration;

        apiUpdateIntervals(newIntervals);
        return newIntervals;
      });

      updateFactor();
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
      } else if (typeof opts.volume !== 'undefined') {
        audios[intervalId].volume = +opts.volume;
      }

        apiUpdateIntervals(newIntervals);
        return newIntervals;
      });
    }
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

export const initIntervals = function() {
  const localIntervals = localStorage.getItem('intervals');
  const localMuted = !!+localStorage.getItem('muted');
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
      sound: {
        id: defaultIdForSound,
        muted: localMuted,
        volume: 0.3,
      },
    },
    break: {
      label: 'interval_labels.break',
      duration: 5,
      sound: {
        id: defaultIdForSound,
        muted: localMuted,
        volume: 0.5,
      },
    },
    longBreak: {
      label: 'interval_labels.long_break',
      duration: 15,
      sound: {
        id: defaultIdForSound,
        muted: localMuted,
        volume: 1,
      },
    },
  });

  updateFactor();

  ['main', 'break', 'longBreak'].forEach(intervalId => {
    audios[intervalId] = new Audio(`sounds/${get(sounds)[get(intervals)[intervalId].sound.id].fileName}`);
    audios[intervalId].volume = parseFloat(get(intervals)[intervalId].sound.volume);
    audios[intervalId].muted = get(intervals)[intervalId].sound.muted;
  });
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

export const apiUpdateIntervals = function(obj) {
  localStorage.setItem('intervals', JSON.stringify(obj));
};

// actions
export const playAudio = function(intervalId) {
  audios[intervalId].play();
};

export const setMute = function(isMute) {
  ['main', 'break', 'longBreak'].forEach(intervalId => {
    audios[intervalId].muted = isMute;
  });

  apiUpdateMuting(isMute);
};

const apiUpdateMuting = (isMuted) => {
  localStorage.setItem('muted', +isMuted);
};
