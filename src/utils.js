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
