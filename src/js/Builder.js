import { Screen } from './Screen';
import { createButton, createNode, colors } from './utils';

const preventDefaults = (e) => {
  e.preventDefault();
  e.stopPropagation();
};

const createInput = (value = 0) => {
  const input = document.createElement('input');
  input.type = 'number';
  input.value = value;
  return input;
};

const createOutput = () => {
  const textarea = document.createElement('textarea');
  textarea.rows = 10;
  textarea.cols = 80;
  return textarea;
};

const createContainer = (className = '') => {
  const node = document.createElement('div');
  node.classList.add(className);
  return node;
};

const createSelect = () => {
  return document.createElement('select');
};

const createOption = (label = '', value = '') => {
  const node = document.createElement('option');
  node.innerText = label;
  node.value = value;
  return node;
};

export class Builder extends Screen {
	constructor() {

    super();
    this.render();

	};
	render() {

    const board = createContainer('builder');
    const nudge = this.nudge = createContainer('nudge');
    const inputs = createContainer('inputs');
    const outputs = createContainer('outputs');
    const modeSelect = this.modeSelect = createSelect();
    const puzzleSelect = this.puzzleSelect = createSelect();
    const positionX = this.positionX = createInput(this.positions[0][1]);
    const positionY = this.positionY = createInput(this.positions[0][2]);
    const space = createInput(this.space);
    const dropZone = this.dropZone = document.querySelector('body');
    const output = this.output = createOutput();
    const undoButton = createButton('undo');
    const changeHandler = () => {
      dropZone.style.backgroundPosition = `calc(50% + ${positionX.value}px) calc(50% + ${positionY.value}px)`;
    };

    let knobs = [];

    board.style.width = board.style.height = `${this.space * (this.looper.length-1)}px`;
    nudge.style.width = nudge.style.height = `${this.space * (this.looper.length-1)}px`;

    this.target.style.position = 'relative';

    this.modes.forEach(([value, label]) => {
      const option = createOption(label, value);
      modeSelect.appendChild(option);
    });

    this.positions.forEach((item, index) => {
      const option = createOption(item[0], index);
      puzzleSelect.appendChild(option);
    });

    this.starLooper.forEach((y) => {
      this.starLooper.forEach((x) => {
        const btn = createNode('div', 'knob');
        btn.addEventListener('click', () => {
          if(this.box==='stars') {
            this.stars[btn.dataset.value] = 1;
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

    positionX.addEventListener('input', changeHandler);
    positionY.addEventListener('input', changeHandler);
    puzzleSelect.addEventListener('input', () => {
      this.reset();
    });
    space.addEventListener('input', () => {
      board.style.width = board.style.height = `${space.value * (this.looper.length-1)}px`;
    });
    modeSelect.addEventListener('input', () => {
      this.box = modeSelect.value;
    });
    undoButton.addEventListener('click', () => {
      this.undo();
    });

    dropZone.addEventListener('dragover', preventDefaults);
    dropZone.addEventListener('dragenter', preventDefaults);
    dropZone.addEventListener('dragleave', preventDefaults);
    dropZone.addEventListener('drop', (e) => {
      
      e.preventDefault();

      const reader = new FileReader();

      reader.onloadend = (e) => {
        dropZone.style.backgroundImage = `url(${e.target.result})`;
        this.reset(true);
      };

      reader.readAsDataURL(e.dataTransfer.files[0]);

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

      if(this.box<7) {
        this.box ++;
      }
      else {
        this.box = 'stars';
      };
      modeSelect.value = this.box;

    });

    inputs.appendChild(modeSelect);
    inputs.appendChild(puzzleSelect);
    inputs.appendChild(undoButton);
    // inputs.appendChild(positionX);
    // inputs.appendChild(positionY);
    // inputs.appendChild(space);

    outputs.appendChild(output);
    
    this.target.appendChild(nudge);
    this.target.appendChild(board);
    this.target.appendChild(inputs);
    this.target.appendChild(outputs);

    this.reset();

	};
  reset(hard = false) {
    
    this.stars = [
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0
    ];
    this.map = [
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0
    ];
    this.history = [];

    this.starButtons.forEach((btn) => {
      btn.dataset.state = 'off';
      btn.classList.remove('star');
    });

    this.box = 0;
    this.modeSelect.value = this.box;

    this.starCount = 0;
    this.nudge.classList.remove('good');

    if(hard) {
      this.puzzleSelect.value = 0;
    };

    this.renderPuzzle();
    this.renderOutput();

  };
  renderOutput(write = true) {
    
    if(write) {
      this.history.push(JSON.stringify([this.stars, this.map]));
    };
    this.output.value = this.history[this.history.length-1];

  };
  renderPuzzle() {

    this.dropZone.style.backgroundPosition = `calc(50% + ${this.positions[this.puzzleSelect.value][1]}px) calc(50% + ${this.positions[this.puzzleSelect.value][2]}px)`;
    this.positionX.value = this.positions[this.puzzleSelect.value][1];
    this.positionY.value = this.positions[this.puzzleSelect.value][2];

    return this;

  };
  undo() {
    
    this.history.pop();

    const previous = JSON.parse(this.history[this.history.length-1]);
    this.stars = previous[1];
    this.map = previous[2];
    this.renderOutput(false);

  };
  set(knob, value, force = false) {
    
    if(force || knob.dataset.state==='off') {
      this.map[knob.dataset.value] = value;
      knob.dataset.box = value;
      knob.dataset.state = 'on';
    };
    
    return this;

  };
  space = 85;
  offset = 20;
  looper = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  starLooper = [0, 1, 2, 3, 4, 5, 6, 7];
  modes = [...colors.map(([name], index) => [index, name]), ['stars', 'stars']];
  positions = [
    ['#1', '437', '373'],
    ['#2', '-466', '311'],
    ['#3', '437', '-462'],
    ['#4', '-465', '-523']
  ];
  starButtons = [];
  box = 0;
  stars = [];
  map = [];
  history = [];
  starCount = 0;
};
