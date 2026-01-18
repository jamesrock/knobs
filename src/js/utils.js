import { Storage } from './Storage';

const formatter = new Intl.NumberFormat('en-GB');
const timeToMinutes = (time) => Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
const timeToSeconds = (time) => Math.floor((time % (1000 * 60)) / 1000);
const pad = (time) => time.toString().padStart(2, '0');
export const timeToDisplay = (time) => `${pad(timeToMinutes(time))}:${pad(timeToSeconds(time))}`;
export const makeEven = (value) => value % 2 === 1 ? value - 1 : value;
export const getRandomIndex = (target) => Math.floor(Math.random() * target.length);
export const getRandom = (target) => target[getRandomIndex(target)];
export const limit = (value, max) => value > max ? max : value;
export const isTiny = () => !window.matchMedia('(min-width: 450px)').matches;
export const formatNumber = n => formatter.format(n);
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
export const createNode = (type, className) => {
  const node = document.createElement(type);
  if(className) {
    node.classList.add(className);
  };
  return node;
};
export const createButton = (label = '', className = '') => {
  const btn = createNode('button', className);
  btn.innerText = label;
  return btn;
};
export const createInput = (value = 0) => {
  const input = document.createElement('input');
  input.type = 'number';
  input.value = value;
  return input;
};
export const createOutput = () => {
  const textarea = document.createElement('textarea');
  textarea.rows = 10;
  textarea.cols = 80;
  return textarea;
};
export const createContainer = (className = '') => {
  return createNode('div', className);
};
export const createSelect = (options) => {
  const node = document.createElement('select');
  options.forEach(([label, value]) => {
    const option = createOption(label, value);
    node.appendChild(option);
  })
  return node;
};
const createOption = (label = '', value = '') => {
  const node = document.createElement('option');
  node.innerText = label;
  node.value = value;
  return node;
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
export const preventDefaults = (e) => {
  e.preventDefault();
  e.stopPropagation();
};