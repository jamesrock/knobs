import { Play } from './Play';
import { Tutorial } from './Tutorial';
import { Screen } from './Screen';
import { storage, createNode, timeToDisplay } from './utils';
import { puzzles } from './puzzles';
import { purchaseManager } from './PurchaseManager';

export class Home extends Screen {
  constructor() {
    
    super();
    this.stats = storage.get('stats');
    this.render();

  };
  render() {

    this.node = createNode('div', 'home-screen');

    this.node.innerHTML = `\
      <h1>knobs</h1>\
      <div class="buttons">\
        <button data-action="play">play</button>\
        <button data-action="tutorial">tutorial</button>\
      </div>\
      <div class="stats">\
        <div>${this.stats.game} / ${puzzles.length}</div>\
        <div>PB ${this.stats.best ? timeToDisplay(this.stats.best) : '-'}</div>\
      </div>\
    `;

    this.node.addEventListener('click', (e) => {
      switch(e.target?.dataset?.action) {
        case 'play':
          this.destroy();
          new Play();
        break;
        case 'tutorial':
          this.destroy();
          new Tutorial();
        break;
      };
    });

    this.target.appendChild(this.node);

  };
};
