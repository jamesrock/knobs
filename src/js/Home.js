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

    const prompt = createNode('div', 'prompt');
    prompt.classList.add('pro');
    prompt.dataset.active = false;

    this.node.addEventListener('click', (e) => {
      switch(e.target?.dataset?.action) {
        case 'play':
          if(this.stats.game>this.limit && !storage.get('pro')) {

            prompt.innerHTML = `\
              <div class="prompt-head">\
                <h2>loving knobs?!</h2>\
              </div>\
              <div class="prompt-body">\
                <p>If so, please consider making a small one-off contribution of ${purchaseManager.price} to unlock all ${puzzles.length} puzzles — plus 500 new puzzles every month!</p>\
              </div>\
              <div class="prompt-foot">
                <button data-action="cancel" class="close">no thanks!</button>\
                <button data-action="gopro">continue</button>\
              </div>\
            `;
          
            prompt.dataset.active = true;

          }
          else {
            this.destroy();
            new Play();
          };
        break;
        case 'tutorial':
          this.destroy();
          new Tutorial();
        break;
      };
    });

    prompt.addEventListener('click', (e) => {
      switch(e.target?.dataset?.action) {
        case 'cancel':
        case 'continue':
          prompt.dataset.active = false;
        break;
        case 'gopro':
          purchaseManager.purchaseInAppProduct(() => {

            storage.set('pro', true);

            prompt.innerHTML = `\
              <div class="prompt-head">\
                <h2>thank you!</h2>\
              </div>\
              <div class="prompt-body">\
                <p>Thank you SO much! Enjoy the game...</p>\
              </div>\
              <div class="prompt-foot">
                <button data-action="continue">continue</button>\
              </div>\
            `;

          });
        break;
      };
    });

    this.target.appendChild(this.node);
    this.target.appendChild(prompt);

  };
  limit = -1;
};
