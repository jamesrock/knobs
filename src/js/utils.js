import { Storage } from './Storage';
export const createNode = (type, className) => {
  const node = document.createElement(type);
  node.classList.add(className);
  return node;
};
export const createButton = (label = '', className = '') => {
  const btn = document.createElement('button');
  btn.innerText = label;
  if(className) {
    btn.classList.add(className);
  };
  return btn;
};
export const shuffle = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  };
  return array;
};
const timeToMinutes = (time) => Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
const timeToSeconds = (time) => Math.floor((time % (1000 * 60)) / 1000);
const pad = (time) => time.toString().padStart(2, '0');
export const timeToDisplay = (time) => `${pad(timeToMinutes(time))}:${pad(timeToSeconds(time))}`;
export const isValidKey = (key, options) => (options.includes(key));
export const makeEven = (value) => value % 2 === 1 ? value - 1 : value;
export const getRandomIndex = (target) => Math.floor(Math.random() * target.length);
export const getRandom = (target) => target[getRandomIndex(target)];
export const limit = (value, max) => value > max ? max : value;
export const getDateString = () => new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'numeric', day: 'numeric'});
export const isDarkMode = () => window.matchMedia('(prefers-color-scheme: dark)').matches;
export const isTiny = () => !window.matchMedia('(min-width: 450px)').matches;
export const storage = new Storage('me.jamesrock.knobs');
const $colors = {
  'dark': {
    'background': 'black',
    'foreground': 'snow',
  },
  'light': [
    ['purple', 'rgb(184, 23, 255)'],
    ['blue', 'rgb(0, 132, 255)'],
    ['yellow', 'gold'],
    ['green', 'rgb(58, 255, 0)'],
    ['orange', 'rgb(255, 135, 0)'],
    ['red', 'red'],
    ['pink', 'magenta'],
    ['cyan', 'cyan']
  ]
};
export const getColor = (key) => $colors[isDarkMode() ? 'dark' : 'light'][key];
export const colors = $colors[isDarkMode() ? 'dark' : 'light'];
