import {
  pad,
  floorTo,
  formatNumber,
  getLast,
  makeNode,
  makeButton,
  makeInput,
  makeOutput,
  makeContainer,
  makeSelect,
  makeArray
} from '@jamesrock/rockjs';
import { Screen } from './Screen';
import { puzzles } from './puzzles';
import { colors } from './utils';

const START = 62;
const END = 70;
const COUNT = 24;

const xValues = [
  1950,
  780,
  -393,
  -1567,
];

const yValues = [
  1820, // 1894
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
].map(([x, y]) => [xValues[x] - 384, yValues[y] + 74]);

const sets = makeArray((END + 1) - START).map((index) => {
  return START + index;
});

const format = (items) => {
  const out = [];
  items.forEach((item) => {
    out.push(JSON.stringify(item));
  });
  return out.join(',\n');
};

export class Builder extends Screen {
	constructor() {

    super();
    this.render();

	};
	render() {

    const board = this.node = makeContainer('builder');
    const nudge = this.nudge = makeContainer('nudge');
    const status = this.status = makeNode('h1', 'status');
    const inputs = makeContainer('inputs');
    const outputs = makeContainer('outputs');
    const modeSelect = this.modeSelect = makeSelect(this.modes);
    const setSelect = this.setSelect = makeSelect(sets.map((value) => [`#${value}`, value]));
    const puzzleSelect = this.puzzleSelect = makeSelect(makeArray(24).map((item, index) => [`#${index+1}`, index]));
    const positionX = this.positionX = makeInput(this.answerPositions[0][0]);
    const positionY = this.positionY = makeInput(this.answerPositions[0][1]);
    const backgroundSize = this.backgroundSize = makeInput(6345);
    const space = makeInput(this.space);
    const dropZone = this.dropZone = document.querySelector('body');
    const output = this.output = makeOutput();
    const size = (this.space * (this.looper.length - 1));
    const undoButton = makeButton('undo');
    const copyButon = makeButton('copy');
    const positionChangeHandler = () => {
      dropZone.style.backgroundPosition = `calc(50% + ${positionX.value}px) calc(50% + ${positionY.value}px)`;
      dropZone.style.backgroundSize = `${backgroundSize.value}px auto`;
    };

    let knobs = [];

    // positionX.step = 10;
    // positionY.step = 10;
    // backgroundSize.step = 10;

    board.style.width = board.style.height = `${size}px`;
    nudge.style.width = nudge.style.height = `${size}px`;

    this.starLooper.forEach((y) => {
      this.starLooper.forEach((x) => {
        const btn = makeNode('div', 'knob');
        btn.addEventListener('click', () => {
          if(this.box==='stars') {
            this.data[this.puzzle][0][btn.dataset.value] = 1;
            btn.classList.add('star');
            this.starCount ++;
            if(this.starCount===8) {
              this.setState('good');
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

    status.innerHTML = `COUNT: ${formatNumber(puzzles.length)}. ${puzzles.length % COUNT === 0 ? 'ALL GOOD' : `MISSING: ${COUNT - (puzzles.length % COUNT)}`}! ${floorTo(puzzles.length / COUNT)}:${pad(puzzles.length % COUNT)}`;

    this.target.classList.add('builder-screen');

    positionX.addEventListener('input', positionChangeHandler);
    positionY.addEventListener('input', positionChangeHandler);
    backgroundSize.addEventListener('input', positionChangeHandler);
    space.addEventListener('input', () => {
      board.style.width = board.style.height = `${space.value * (this.looper.length-1)}px`;
    });

    setSelect.addEventListener('input', () => {
      this.reset(true);
    });

    puzzleSelect.addEventListener('input', () => {
      this.setPuzzle(Number(puzzleSelect.value));
      this.reset();
    });

    modeSelect.addEventListener('input', () => {
      this.setBox(Number(modeSelect.value));
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

      if(this.state==='good' && this.puzzle < 24) {
        this.setPuzzle(this.puzzle + 1);
        this.reset();
        return;
      };

      if(this.box < 7) {
        this.setBox(this.box + 1);
      }
      else {
        this.setBox('stars');
      };

    });

    copyButon.addEventListener('click', () => {
      navigator.clipboard.writeText(format(this.data));
      copyButon.innerText = 'copied!';
      setTimeout(() => {
        copyButon.innerText = 'copy';
      }, 2000);
    });

    inputs.append(modeSelect);
    inputs.append(setSelect);
    inputs.append(puzzleSelect);
    inputs.append(undoButton);
    inputs.append(copyButon);
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
    this.reset(true);

	};
  reset(hard = false) {

    if(hard) {
      this.data = makeArray(24, () => [makeArray(8*8, () => 0), makeArray(8*8, () => 0)]);
      this.history = [];
      this.setPuzzle(0);
    };

    this.starButtons.forEach((btn) => {
      btn.dataset.state = 'off';
      btn.classList.remove('star');
    });

    this.setBox(0);
    this.setState('awaiting');
    this.starCount = 0;

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

    this.dropZone.style.backgroundImage = `url(/puzzles/${this.setSelect.value}-answers.png)`;
    this.dropZone.style.backgroundPosition = `calc(50% + ${this.answerPositions[this.puzzle][0]}px) calc(50% + ${this.answerPositions[this.puzzle][1]}px)`;
    this.dropZone.style.backgroundSize = `${this.backgroundSize.value}px auto`;

    this.positionX.value = this.answerPositions[this.puzzle][0];
    this.positionY.value = this.answerPositions[this.puzzle][1];

    return this;

  };
  undo() {

    this.history.pop();
    this.data = JSON.parse(getLast(this.history));
    this.renderOutput(false);

  };
  set(knob, value, force = false) {

    if(force || knob.dataset.state==='off') {
      this.data[this.puzzle][1][knob.dataset.value] = value;
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
  setState(state) {

    this.state = state;
    this.nudge.setAttribute('data-state', this.state);
    return this;

  };
  setPuzzle(puzzle) {

    this.puzzle = puzzle;
    this.puzzleSelect.value = this.puzzle;
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
  starCount = 0;
};
