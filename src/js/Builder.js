import {
  formatNumber,
  createNode,
  createButton,
  createInput,
  createOutput,
  createContainer,
  createSelect,
  getLast,
  makeArray
} from '@jamesrock/rockjs';
import { Screen } from './Screen';
import { puzzles } from './puzzles';
import { colors } from './utils';

const START = 44;
const END = 70;

const xValues = [
  1950,
  780,
  -393,
  -1567,
];

const yValues = [
  1820,
  890,
  -37,
  -966,
  -1894,
  -2823
];

const positions = [
  [0, 0],
  [1, 0],
  [2, 0],
  [3, 0],
  [0, 1],
  [1, 1],
  [2, 1],
  [3, 1],
  [0, 2],
  [1, 2],
  [2, 2],
  [3, 2],
  [0, 3],
  [1, 3],
  [2, 3],
  [3, 3],
  [0, 4],
  [1, 4],
  [2, 4],
  [3, 4],
  [0, 5],
  [1, 5],
  [2, 5],
  [3, 5],
  [0, 6],
  [1, 6],
  [2, 6],
  [3, 6]
].map(([x, y]) => [xValues[x], yValues[y]]);

const sets = makeArray((END + 1) - START).map((index) => {
  return START + index;
});

export class Builder extends Screen {
	constructor() {

    super();
    this.render();

	};
	render() {

    const board = this.node = createContainer('builder');
    const nudge = this.nudge = createContainer('nudge');
    const status = this.status = createNode('h1', 'status');
    const inputs = createContainer('inputs');
    const outputs = createContainer('outputs');
    const modeSelect = this.modeSelect = createSelect(this.modes);
    const setSelect = this.setSelect = createSelect(sets.map((value) => [`#${value}`, value]));
    const puzzleSelect = this.puzzleSelect = createSelect(makeArray(24).map((item, index) => [`#${index+1}`, index]));
    const positionX = this.positionX = createInput(this.answerPositions[0][0]);
    const positionY = this.positionY = createInput(this.answerPositions[0][1]);
    const backgroundSize = this.backgroundSize = createInput(500);
    const space = createInput(this.space);
    const dropZone = this.dropZone = document.querySelector('body');
    const output = this.output = createOutput();
    const undoButton = createButton('undo');
    const size = (this.space * (this.looper.length-1));
    const positionChangeHandler = () => {
      // dropZone.style.backgroundPosition = `calc(50% + ${positionX.value}px) calc(50% + ${positionY.value}px)`;
      dropZone.style.backgroundPosition = `calc(50% + ${positionX.value}px) calc(50% + ${positionY.value}px)`;
      dropZone.style.backgroundSize = `${backgroundSize.value}% auto`;
    };
    const puzzleChangeHandler = () => {
      this.reset();
    };

    this.data = makeArray(24, () => [makeArray(8*8, () => 0), makeArray(8*8, () => 0)]);
    this.history = [];

    let knobs = [];

    // positionX.step = 10;
    // positionY.step = 10;
    backgroundSize.step = 10;

    board.style.width = board.style.height = `${size}px`;
    nudge.style.width = nudge.style.height = `${size}px`;

    this.starLooper.forEach((y) => {
      this.starLooper.forEach((x) => {
        const btn = createNode('div', 'knob');
        btn.addEventListener('click', () => {
          if(this.box==='stars') {
            this.data[this.puzzleSelect.value][0][btn.dataset.value] = 1;
            btn.classList.add('star');
            this.starCount ++;
            if(this.starCount===8) {
              nudge.classList.add('good');
            };
          }
          else {
            this.set(btn, Number(this.box), true);
          };
          this.renderOutput();
        });
        btn.style.top = `${(y * this.space) + 10}px`;
        btn.style.left = `${(x * this.space) + 10}px`;
        btn.style.width = `${this.space - 20}px`;
        btn.style.height = `${this.space - 20}px`;
        btn.dataset.state = 'off';
        btn.dataset.x = x;
        btn.dataset.y = y;
        btn.dataset.value = this.starButtons.length;
        board.appendChild(btn);
        this.starButtons.push(btn);
      });
    });

    status.innerText = `COUNT: ${formatNumber(puzzles.length)}. ${puzzles.length%24 === 0 ? 'ALL GOOD' : `MISSING: ${24-(puzzles.length%24)}`}!`;

    this.target.classList.add('builder-screen');

    positionX.addEventListener('input', positionChangeHandler);
    positionY.addEventListener('input', positionChangeHandler);
    backgroundSize.addEventListener('input', positionChangeHandler);
    setSelect.addEventListener('input', puzzleChangeHandler);
    puzzleSelect.addEventListener('input', puzzleChangeHandler);

    space.addEventListener('input', () => {
      board.style.width = board.style.height = `${space.value * (this.looper.length-1)}px`;
    });
    modeSelect.addEventListener('input', () => {
      this.setBox(modeSelect.value);
    });
    undoButton.addEventListener('click', () => {
      this.undo();
    });

    board.addEventListener('touchstart', () => {
			knobs = [];
		});

		board.addEventListener('touchmove', (e) => {
			const knob = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
			if(knob?.classList.contains('knob')) {
				if(knobs.indexOf(knob)===-1) {
					knobs.push(knob);
          this.set(knob, Number(this.box));
          this.renderOutput();
				};
			};
			e.preventDefault();
		});

    nudge.addEventListener('click', () => {

      if(this.box < 7) {
        this.setBox(this.box + 1);
      }
      else {
        this.setBox('stars');
      };

    });

    output.addEventListener('focus', () => {
      navigator.clipboard.writeText(output.value);
    });

    inputs.append(modeSelect);
    inputs.append(setSelect);
    inputs.append(puzzleSelect);
    inputs.append(undoButton);
    // inputs.append(positionX);
    // inputs.append(positionY);
    // inputs.append(backgroundSize);
    // inputs.append(space);

    outputs.append(output);

    this.target.append(status);
    this.target.append(nudge);
    this.target.append(board);
    this.target.append(inputs);
    this.target.append(outputs);

    this.setColors();
    this.reset();

	};
  reset() {

    this.starButtons.forEach((btn) => {
      btn.dataset.state = 'off';
      btn.classList.remove('star');
    });

    this.setBox(0);

    this.starCount = 0;
    this.nudge.classList.remove('good');

    this.renderPuzzle();
    this.renderOutput();

  };
  renderOutput(write = true) {

    if(write) {
      this.history.push(JSON.stringify(this.data));
    };
    this.output.value = getLast(this.history);

  };
  renderPuzzle() {

    // this.dropZone.style.backgroundPosition = `calc(50% + ${this.positions[this.puzzleSelect.value][1]}px) calc(50% + ${this.positions[this.puzzleSelect.value][2]}px)`;
    this.dropZone.style.backgroundImage = `url(/puzzles/${this.setSelect.value}-answers.png)`;
    this.dropZone.style.backgroundPosition = `calc(50% + ${this.answerPositions[this.puzzleSelect.value][0]}px) calc(50% + ${this.answerPositions[this.puzzleSelect.value][1]}px)`;
    this.dropZone.style.backgroundSize = `${this.backgroundSize.value}% auto`;

    this.positionX.value = this.answerPositions[this.puzzleSelect.value][0];
    this.positionY.value = this.answerPositions[this.puzzleSelect.value][1];

    return this;

  };
  undo() {

    this.history.pop();
    this.data = JSON.parse(getLast(this.history));
    this.renderOutput(false);

  };
  set(knob, value, force = false) {

    if(force || knob.dataset.state==='off') {
      this.data[this.puzzleSelect.value][1][knob.dataset.value] = value;
      knob.dataset.box = value;
      knob.dataset.state = 'on';
    };

    return this;

  };
  setBox(box) {

    this.box = box;
    this.modeSelect.value = this.box;
    this.node.setAttribute('data-box', this.box);
    return this;

  };
  setColors() {
    let $colours = [...colors];
    $colours.forEach(([name, value], index) => {
      this.node.style.setProperty(`--box-${index}`, value);
    });
    return this;
  };
  space = 85;
  offset = 20;
  looper = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  starLooper = [0, 1, 2, 3, 4, 5, 6, 7];
  modes = [...colors.map(([name], index) => [name, index]), ['stars', 'stars']];
  answerPositions = positions;
  starButtons = [];
  box = 0;
  stars = [];
  map = [];
  history = [];
  starCount = 0;
};
