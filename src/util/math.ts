// euclidean distance between two points
export const dist = (x1 = 0, y1 = 0, x2 = 0, y2 = 0): number =>
  Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

// trig funcs in degrees
export const sin = (degrees = 0): number =>
  Math.sin((2 * Math.PI * degrees) / 360);
export const cos = (degrees = 0): number =>
  Math.cos((2 * Math.PI * degrees) / 360);

// round number to divisor
export const round = (number = 0, divisor = 1): number =>
  Math.round(number / divisor) * divisor;
