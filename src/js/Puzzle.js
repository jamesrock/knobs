import { makeEven, limit, isTiny, makeNode, shuffle } from '@jamesrock/rockjs';
import { puzzles } from './puzzles';
import { storage, colors } from './utils';

export class Puzzle {
	constructor(selector, solvedHandler, saved = -1) {

		const stats = storage.get('stats');
		const history = storage.get('history');
		const getter = saved > -1 ? saved : stats.game;
		const puzzle = puzzles[getter];

		this.starLooper.forEach((y) => {
      this.starLooper.forEach((x) => {
				this.tileMap.push([x, y]);
      });
    });

		this.stars = puzzle[0];
		this.map = puzzle[1];
    this.tiles = this.tileMap.map((tile, index) => {
      return new PuzzleTile(tile[0], tile[1], this.map[index], this.stars[index]);
    });
		this.target = document.querySelector(selector);
    this.solvedHandler = solvedHandler;
		this.getter = getter;
		this.id = `#${getter + 1}`;

		if(saved === -1 && history && history[0]===getter) {
			history[1].forEach((state, index) => {
				this.tiles[index].state = (state === 1 ? 'on' : 'off');
			});
		};

		if(saved > -1) {
			this.randomColors = false;
		};

		this.render();

	};
	render() {

		const puzzle = this.node = makeNode('div', 'puzzle');
		const gap = isTiny() ? 5 : 10;
		const size = makeEven(limit(Math.round((window.innerWidth - (gap * ((this.size - 1) + 4))) / this.size), 60));
		let knobs = [];

		puzzle.style.width = puzzle.style.height = `${(size * this.size) + (gap * (this.size - 1))}px`;

		this.tiles.forEach((tile, index) => {

			const knob = makeNode('div', 'knob');
			knob.style.top = `${(tile.y * size) + (gap * tile.y)}px`;
			knob.style.left = `${(tile.x * size) + (gap * tile.x)}px`;
			knob.style.width = `${size}px`;
			knob.style.height = `${size}px`;
			knob.dataset.index = index;
			knob.dataset.box = tile.b;
			knob.dataset.animation = tile.animation;
			if(this.labels) {
				knob.innerText = index;
			};

			knob.addEventListener('click', () => {
				tile.toggle();
				this.updateStates();
				this.checkForWin();
			});

			puzzle.appendChild(knob);
			this.knobs.push(knob);

		});

		puzzle.addEventListener('touchstart', () => {
			knobs = [];
		});

		puzzle.addEventListener('touchmove', (e) => {
			const knob = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
			if(knob?.classList.contains('knob')) {
				if(knobs.indexOf(knob)===-1) {
					knobs.push(knob);
					this.tiles[knob.dataset.index].disable();
					this.updateStates();
				};
			};
			e.preventDefault();
		});

		puzzle.addEventListener('touchend', () => {
			this.checkForWin();
		});

		this.target.appendChild(puzzle);

		this.setColors();
		this.updateStates();
		this.runAnimation();

		// setTimeout(() => {
		// 	this.autoComplete();
		// }, 2000);

	};
	updateStates() {

		this.tiles.forEach((tile, index) => {
			this.knobs[index].dataset.state = tile.state;
			this.knobs[index].dataset.animation = tile.animation;
			this.knobs[index].dataset.visible = tile.visible;
		});
		storage.set('history', [this.getter, this.getData()]);
		return this;

	};
	checkForWin() {

		const off = this.tiles.filter((tile) => {
			return tile.state==='off'&&tile.value===0;
		}).length;
		if(off===((this.size*this.size)-this.size)) {
			this.solvedHandler();
		};
		if(!this.randomColors) {
			const oranges = this.tiles.filter((tile) => {
				return tile.b===4&&tile.state==='off';
			}).length;
			if(oranges===3) {
				this.solvedHandler(true);
			};
		};
		return this;

	};
	destroy() {

		this.node.parentNode.removeChild(this.node);
		return this;

	};
	reset() {

		this.tiles.forEach((tile) => {
			tile.enable();
		});
		this.updateStates();
		return this;

	};
	autoComplete() {

		this.tiles.forEach((tile) => {
			if(tile.value===1) {
				tile.enable();
			}
			else {
				tile.disable();
			};
		});

		this.updateStates();
		this.checkForWin();
		return this;

	};
	runAnimation(a = 0, speed = 55) {

		this.hide();

		const animation = this.animations[a];

		setTimeout(() => {
			animation.forEach((line, index) => {
				setTimeout(() => {
					line.forEach((item) => {
						this.tiles[item].show();
					});
					this.updateStates();
					if(index===animation.length-1) {
						setTimeout(() => {
							this.clearAnimations();
						}, 500);
					};
				}, speed*index);
			});
		}, 100);

	};
	clearAnimations() {

		this.tiles.forEach((tile) => {
			tile.clearAnimation();
		});
		this.updateStates();
		return this;

	};
	getData() {
		return this.tiles.map((tile) => {
			return tile.state === 'on' ? 1 : 0;
		});
	};
	show() {

		this.tiles.forEach((tile) => {
			tile.show();
		});
		this.updateStates();
		return this;

	};
	hide() {

		this.tiles.forEach((tile) => {
			tile.hide();
		});
		this.updateStates();
		return this;

	};
	setColors() {
		let $colours = [...colors];
		if(this.randomColors) {
			$colours = shuffle($colours);
		};
		$colours.forEach(([name, value], index) => {
			this.node.style.setProperty(`--box-${index}`, value);
		});
		return this;
	};
	animations = [
		[
			[27, 28, 35, 36],
			[18, 19, 20, 21, 29, 37, 45, 44, 43, 42, 34, 26],
			[9, 10, 11, 12, 13, 14, 22, 30, 38, 46, 54, 53, 52, 51, 50, 49, 41, 33, 25, 17],
			[0, 1, 2, 3, 4, 5, 6, 7, 15, 23, 31, 39, 47, 55, 63, 62, 61, 60, 59, 58, 57, 56, 48, 40, 32, 24, 16, 8]
		],
		[
			[0],
			[8, 1],
			[16, 9, 2],
			[24, 17, 10, 3],
			[32, 25, 18, 11, 4],
			[40, 33, 26, 19, 12, 5],
			[48, 41, 34, 27, 20, 13, 6],
			[56, 49, 42, 35, 28, 21, 14, 7],
			[57, 50, 43, 36, 29, 22, 15],
			[58, 51, 44, 37, 30, 23],
			[59, 52, 45, 38, 31],
			[60, 53, 46, 39],
			[61, 54, 47],
			[62, 55],
			[63]
		]
	];
	size = 8;
	starLooper = [0, 1, 2, 3, 4, 5, 6, 7];
	tileMap = [];
	knobs = [];
	labels = false;
	randomColors = true;
};

class PuzzleTile {
	constructor(x, y, b, value = 0) {

		this.value = value;
		this.state = 'on';
		this.animation = 'bounce';
		this.visible = true;
		this.x = x;
		this.y = y;
		this.b = b;

	};
	toggle() {

		if(this.state==='on') {
			this.state = 'off';
		}
		else {
			this.state = 'on';
		};

		return this;

	};
	disable() {

		this.state = 'off';
		return this;

	};
	enable() {

		this.state = 'on';
		return this;

	};
	highlight() {

		this.state = 'highlight';
		return this;

	};
	unhighlight() {

		return this.enable();

	};
	clearAnimation() {

		this.animation = 'linear';
		return this;

	};
	show() {

		this.visible = true;
		return this;

	};
	hide() {

		this.visible = false;
		return this;

	};
};
