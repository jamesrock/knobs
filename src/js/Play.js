import { makeNode, formatTime } from '@jamesrock/rockjs';
import { Puzzle } from './Puzzle';
import { Home } from './Home';
import { Screen } from './Screen';
import { puzzles } from './puzzles';
import { storage } from './utils';

export class Play extends Screen {
  constructor() {

    super();
    this.render();

  };
  render() {

    this.node = makeNode('div', 'play-screen');

    this.node.innerHTML = `\
      <h1>knobs</h1>\
      <div id="board"></div>\
      <div class="buttons">\
        <button data-action="reset">reset</button>\
        <button data-action="home">home</button>\
      </div>\
    `;

    this.node.addEventListener('click', (e) => {
      switch(e.target?.dataset?.action) {
        case 'reset':
          this.puzzle.reset();
        break;
        case 'home':
          this.destroy();
          new Home();
        break;
        case 'new':
          this.startNewGame();
        break;
      };
    });

    const solvedNode = this.solvedNode = makeNode('div', 'solved');
    solvedNode.dataset.action = 'new';

    this.node.appendChild(solvedNode);
    this.target.appendChild(this.node);

    this.startNewGame();

  };
  removeOld() {

    if(this.puzzle) {
      this.puzzle.destroy();
      this.puzzle = null;
    };

  };
  startNewGame() {

    const stats = storage.get('stats');

    if(stats.game<puzzles.length) {

      this.solvedNode.dataset.state = 'disabled';

      this.removeOld();

      this.puzzle = new Puzzle('#board', this.solvedHandler.bind(this));

      this.node.querySelector('h1').innerText = `knobs ${this.puzzle.id}`;

      this.start = Date.now();

    }
    else {

      this.destroy();
      new Home();

    };

  };
  solvedHandler() {

    const stats = storage.get('stats');
    const time = (Date.now() - this.start);
    this.solvedNode.innerHTML = `\
    <div class="solved-body">\
      <h2>knobs ${this.puzzle.id}</h2>\
      <h3>solved!</h3>\
      <p class="time">Time: ${formatTime(time)}</p>\
      <p class="continue">Tap to continue.</p>\
    </div>`;
    setTimeout(() => {
      this.solvedNode.dataset.state = 'enabled';
    }, 500);
    storage.set('stats', {
      ...stats,
      game: stats.game + 1,
      best: !stats.best ? time : (time < stats.best ? time : stats.best)
    });

  };
};
