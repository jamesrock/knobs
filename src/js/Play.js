import { Puzzle } from './Puzzle';
import { Home } from './Home';
import { Screen } from './Screen';
import { createNode, timeToDisplay, storage } from './utils';

let start = 0;
let puzzle = null;
let time = 0;

const solvedNode = createNode('div', 'solved');

solvedNode.addEventListener('click', () => {
  startNewGame();
});

const solvedHandler = () => {
  const stats = storage.get('stats');
  time = (Date.now() - start);
  solvedNode.innerHTML = `<div class="game-over-body">\
    <h2>knobs ${puzzle.id}</h2>\
    <h3>solved!</h3>\
    <p class="time">Time: ${timeToDisplay(time)}</p>\
    <p class="continue">Tap to continue.</p>\
  </div>`;
  setTimeout(() => {
    solvedNode.dataset.state = 'enabled';
  }, 500);
  storage.set('stats', {
    ...stats,
    game: stats.game + 1,
    best: !stats.best ? time : (time < stats.best ? time : stats.best)
  });
};

const startNewGame = () => {

  solvedNode.dataset.state = 'disabled';

  removeOld();

  puzzle = new Puzzle('#board', solvedHandler);

  document.querySelector('h1').innerText = `knobs ${puzzle.id}`;

  start = Date.now();

};

const removeOld = () => {
  
  if(puzzle) {
    puzzle.destroy();
    puzzle = null;
  };

};

export class Play extends Screen {
  constructor() {
    
    super();
    this.render();

  };
  render() {

    this.node = createNode('div', 'play-screen');

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
          puzzle.reset()
        break;
        case 'home':
          this.destroy();
          new Home();
        break;
      };
    });

    this.node.appendChild(solvedNode);

    this.target.appendChild(this.node);

    startNewGame();

  };
};