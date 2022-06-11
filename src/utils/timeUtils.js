import { _ } from './langUtils.js';
import { makeTwoDigitsCifer } from './generalUtils.js';

export const getFullTimeFromTimestamp = (milliseconds) => {
  const dateObj = new Date(milliseconds);
  
  return `${
    makeTwoDigitsCifer(dateObj.getHours())
  }:${
    makeTwoDigitsCifer(dateObj.getMinutes())
  }:${
    makeTwoDigitsCifer(dateObj.getSeconds())
  }`;
};

export const getMinutesSecondsObjFromSeconds = (seconds) => {
  return {
    mins: makeTwoDigitsCifer(Math.floor(seconds / 60)),
    secs: makeTwoDigitsCifer(seconds % 60)
  }
};

export const getHoursAndMinutesFromMinutes = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const resultMinutes = Math.ceil(minutes % 60);

  return hours
    ? `${hours}${_('hours_short')} ${resultMinutes}${_('minutes_short')}`
    : `${resultMinutes}${_('minutes_short')}`;
};

export const getHoursAndMinutesFromTimestamp = (dateStamp) => {
  const date = new Date(dateStamp);

  return `${makeTwoDigitsCifer(date.getHours())}:${makeTwoDigitsCifer(date.getMinutes())}`;
};

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
};

export const getDateStampByDayTitleAndTime = (dayTitle, time) => {
  return +new Date(`${convertDate(dayTitle)} ${time}`);
};

export const makeEuropeanTime = (units = 0) => {
  return units
    ? `${makeTwoDigitsCifer(Math.floor(units / 60))}:${makeTwoDigitsCifer(units % 60)}`
    : '';
};
