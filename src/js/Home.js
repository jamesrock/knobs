import { Play } from './Play';
import { Tutorial } from './Tutorial';
import { Screen } from './Screen';
import { storage, createNode, timeToDisplay } from './utils';
import { puzzles } from './puzzles';
import { store } from './Store';

export class Home extends Screen {
  constructor() {
    
    super();
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
      <div class="home-screen-foot">\
        <button data-action="restore" class="close restore">restore purchase</button>\
      </div>\
    `;

    const prompt = createNode('div', 'prompt');
    prompt.classList.add('pro');
    prompt.dataset.active = false;

    this.node.addEventListener('click', (e) => {
      switch(e.target?.dataset?.action) {
        case 'play':
          if(this.stats.game>=this.limit && !storage.get('pro')) {

            store.checkSupport().then(({isBillingSupported}) => {
              if(isBillingSupported) {
                store.fetchProduct().then(({product}) => {

                  prompt.innerHTML = `\
                    <div class="prompt-head">\
                      <h2>loving knobs?!</h2>\
                    </div>\
                    <div class="prompt-body">\
                      <p>Please consider making a small one-off contribution of ${product.priceString} to unlock all ${puzzles.length} puzzles — plus 500 new puzzles every month!</p>\
                    </div>\
                    <div class="prompt-foot">
                      <button data-action="cancel" class="close">no thanks!</button>\
                      <button data-action="gopro">continue</button>\
                    </div>\
                  `;
                
                  prompt.dataset.active = true;

                });
              }
              else {
                
                prompt.innerHTML = `\
                  <div class="prompt-head">\
                    <h2>download the app!</h2>\
                  </div>\
                  <div class="prompt-body">\
                    <p>Only ${this.limit} free games are supported online. Please download the knobs app to play all levels.</p>\
                  </div>\
                  <div class="prompt-foot">
                    <button data-action="cancel">close</button>\
                  </div>\
                `;

                prompt.dataset.active = true;

              };
            });

          }
          else if(this.stats.game<puzzles.length) {
            this.destroy();
            new Play();
          }
          else {

            prompt.innerHTML = `\
              <div class="prompt-head">\
                <h2>Harry!<br />I've reached the top!</h2>\
              </div>\
              <div class="prompt-body">\
                <p>You've only gone and completed ALL ${puzzles.length} puzzles! 500 new puzzles are dropped every month, on or around the 1st. Check the App Store for any updates.</p>\
              </div>\
              <div class="prompt-foot">
                <button data-action="cancel">close</button>\
              </div>\
            `;
          
            prompt.dataset.active = true;

          };
        break;
        case 'restore':
          store.restorePurchases();
        break;
        case 'tutorial':
          this.destroy();
          new Tutorial();
        break;
        case 'cancel':
        case 'continue':
          prompt.dataset.active = false;
        break;
        case 'gopro':
          store.purchaseProduct().then((receipt) => {

            console.log(receipt.transactionId);

            storage.set('pro', true);

            prompt.innerHTML = `\
              <div class="prompt-head">\
                <h2>amazing!</h2>\
              </div>\
              <div class="prompt-body">\
                <p>Thank you SO much! Your small contribution makes a BIG difference. Those levels don't program themselves, after all!</p>\
              </div>\
              <div class="prompt-foot">
                <button data-action="continue">continue</button>\
              </div>\
            `;

          }).catch((error) => {
            
            if(error.message.includes('User cancelled')) {
              console.log('User cancelled the purchase');
            }
            else if(error.message.includes('Network')) {
              alert('Network error. Please check your connection and try again.');
            }
            else {
              alert('Purchase failed. Please try again.');
            };

          });
        break;
      };
    });

    this.node.appendChild(prompt);
    this.target.appendChild(this.node);

  };
  limit = 10;
};
