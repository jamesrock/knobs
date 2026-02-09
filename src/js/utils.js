import { Storage } from '@jamesrock/rockjs';

export const storage = new Storage('me.jamesrock.knobs');
export const colors = [
  ['purple', 'rgb(184, 23, 255)'],
  ['blue', 'rgb(0, 132, 255)'],
  ['yellow', 'gold'],
  ['green', 'rgb(58, 255, 0)'],
  ['orange', 'rgb(255, 135, 0)'],
  ['red', 'red'],
  ['pink', 'magenta'],
  ['cyan', 'cyan']
];

export const preventDefaults = (e) => {
  e.preventDefault();
  e.stopPropagation();
};