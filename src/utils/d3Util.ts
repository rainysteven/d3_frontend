import { InternMap } from 'd3';

export const nest = function (array: InternMap) {
  return Array.from(array, ([key, value]) => ({
    key,
    value,
  }));
};
