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
};

export const makeTwoDigitsCifer = (cifer) => {
  return cifer.toString().padStart(2, 0);
};

export const getRandomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  const color = '#' + makeTwoDigitsCifer(r.toString(16))
    + makeTwoDigitsCifer(g.toString(16))
    + makeTwoDigitsCifer(b.toString(16));

  return color;
};

export const getDeepProperty = (obj, arrPath) => {
  return arrPath.reduce((result, item) => {
    return result?.[item];
  }, obj);
};

export class DeferredBoolean {
  constructor() {
    this.promise = new Promise((resolve, reject)=> {
      this.reject = reject;
      this.resolve = resolve;
    })
    .then(() => true)
    .catch(() => false);
  }
};
