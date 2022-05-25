import { _ } from './lang-utils.js';

export const makeTwoDigitsCifer = (cifer) => {
  return cifer.toString().padStart(2, 0);
};

export const makeEuropeanTime = (units = 0) => {
  return units ? `${makeTwoDigitsCifer(Math.floor(units / 60))}:${makeTwoDigitsCifer(units % 60)}` : '';
};

export const getRandomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  const color = '#' + makeTwoDigitsCifer(r.toString(16)) + makeTwoDigitsCifer(g.toString(16)) + makeTwoDigitsCifer(b.toString(16));

  return color;
}

export const makeAbsoluteTimeString = (milliseconds, withSeconds = false) => {
  const dateObj = new Date(milliseconds);
  
  return `${
    makeTwoDigitsCifer(dateObj.getHours())
  }:${
    makeTwoDigitsCifer(dateObj.getMinutes())
  }${
    withSeconds ? ':' + makeTwoDigitsCifer(dateObj.getSeconds()) : ''
  }`;
};

export const getHoursAndMinutesFromMinutes = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const resultMinutes = Math.ceil(minutes % 60);

  return hours
    ? `${hours}${_('hours_short')} ${resultMinutes}${_('minutes_short')}`
    : `${resultMinutes}${_('minutes_short')}`;
};

export const getHoursAndMinutesFromDateStamp = (dateStamp) => {
  const date = new Date(dateStamp);

  return `${makeTwoDigitsCifer(date.getHours())}:${makeTwoDigitsCifer(date.getMinutes())}`;
}

export const convertDate = (dateString, fromCustomToDate = true) => {
  if (fromCustomToDate) {
    return dateString.split('.').reverse().join('-');
  } else {
    return dateString.split('-').reverse().join('.');
  }
};

export const getReadableMonthYear = (dateStr) => {
  const dateArr = dateStr.split('.');

  return `${_('months.' + String(+dateArr[0]))} ${dateArr[1]}`;
}

export const isRangeIntersectRanges = (range, ranges) => {
  const [checkingStart, checkingEnd] = range;

  return ranges.some(([start, end]) => {
    if (
      (checkingStart >= start && checkingStart < end) ||
      (checkingEnd > start && checkingEnd <= end) ||
      (checkingStart <= start && checkingEnd >= end)
    ) {
      return true;
    }
  });
}

export const getDateStampByDayTitleAndTime = (dayTitle, time) => {
  return +new Date(`${convertDate(dayTitle)} ${time}`);
}
