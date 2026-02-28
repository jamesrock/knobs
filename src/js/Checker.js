import { makeNode } from '@jamesrock/rockjs';
import { Screen } from './Screen';
import { Puzzle } from './Puzzle';
import { puzzles } from './puzzles';

export class Checker extends Screen {
  constructor() {

    super();
    this.render();

  };
  render() {

    this.node = makeNode('div', 'checker-screen');
    this.target.appendChild(this.node);

    document.body.classList.add('auto-height');
    document.documentElement.classList.add('auto-overflow');

    puzzles.forEach((puzzle, index) => {
      const holder = makeNode('div', 'holder');
      const holderHead = makeNode('div', 'holder-head');
      const holderBody = makeNode('div', 'holder-body');
      holder.appendChild(holderHead);
      holder.appendChild(holderBody);

      holderHead.innerHTML = `<h2>v: ${this.volume + 1} / b: ${this.book + 1} / p: ${this.puzzle + 1} / #${index + 1}</h2>`;
      const id = `puzzle-${index}`;
      this.node.appendChild(holder);
      holderBody.id = id;
      new Puzzle(`#${id}`, () => {}, index);

      if(this.puzzle < this.puzzlesInBook - 1) {
        this.puzzle ++;
      }
      else {
        this.book ++;
        this.puzzle = 0;
      };

      if(this.volume < this.booksInVolume - 1) {
        // do nothing
      }
      else {
        this.volume ++;
      };

    });

  };
  volume = 0;
  book = 0;
  puzzle = 0;
  booksInVolume = 100;
  puzzlesInBook = 24;
};
