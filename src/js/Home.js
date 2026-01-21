import { Play } from './Play';
import { Tutorial } from './Tutorial';
import { Screen } from './Screen';
import { storage, createNode, timeToDisplay, formatNumber } from './utils';
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
        <div>${formatNumber(this.stats.game)} / ${formatNumber(puzzles.length)}</div>\
        <div>PB ${this.stats.best ? timeToDisplay(this.stats.best) : '-'}</div>\
      </div>\
      <div class="home-screen-foot" data-visible="${!storage.get('pro')}">\
        <button data-action="restore">go pro&nbsp;&nbsp;|&nbsp;&nbsp;restore</button>\
      </div>\
    `;

    const prompt = this.prompt = createNode('div', 'prompt');
    prompt.classList.add('pro');
    prompt.dataset.active = false;

    this.node.addEventListener('click', (e) => {
      switch(e.target?.dataset?.action) {
        case 'play':
          if(this.stats.game>=this.limit && !storage.get('pro')) {

            this.restore();

          }
          else if(this.stats.game<puzzles.length) {
            
            this.destroy();
            new Play();

          }
          else {

            this.showPrompt(
              "Harry!<br />I've reached the top!", 
              `You've only gone and completed ALL ${puzzles.length} puzzles! 500 new puzzles are dropped every month, on or around the 1st. Check the App Store for any updates.`,
              [
                ['close', 'continue']
              ]
            );

          };
        break;
        case 'restore':

          this.restore(true);

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

            this.showPrompt(
              'amazing!', 
              "Thank you SO much! Your small contribution makes a BIG difference. Those levels don't program themselves, after all!",
              [
                ['continue', 'continue']
              ]
            );

          }).catch((error) => {
            
            this.showPrompt(
              'purchase failed.', 
              `${error.message}. Please try again.`,
              [
                ['continue', 'continue']
              ]
            );

          });
        break;
      };
    });

    this.node.appendChild(prompt);
    this.target.appendChild(this.node);

  };
  showPrompt(heading = '{heading}', body = '{body}', actions = []) {
    
    this.prompt.innerHTML = `\
      <div class="prompt-head">\
        <h2>${heading}</h2>\
      </div>\
      <div class="prompt-body">\
        <p>${body}</p>\
      </div>\
      <div class="prompt-foot">\
        ${actions.map(([label, action]) => {
          return `<button data-action="${action}">${label}</button>`;
        }).join('')}\
      </div>\
    `;

    this.prompt.dataset.active = true;
    
  };
  restore(verbose = false) {

    store.checkSupport().then(({isBillingSupported}) => {
      if(isBillingSupported) {

        store.getPurchases().then(({purchases}) => {

          purchases.forEach((purchase) => {
            if(store.validatePurchase(purchase)) {
              storage.set('pro', true);
            };
          });

          if(storage.get('pro')) {

            if(verbose) {
              
              this.showPrompt(
                'fully restored!', 
                'Thanks once again! You\'re all set.', 
                [
                  ['continue', 'continue']
                ]
              );

            }
            else {
              
              this.destroy();
              new Play();

            };

          }
          else {

            store.getProduct().then(({product}) => {

              this.showPrompt(
                'loving knobs?!', 
                `Please consider making a small one-off contribution of ${product.priceString} to unlock all ${formatNumber(puzzles.length)} puzzles — plus 500 new puzzles every month!`,
                [
                  ['no thanks!', 'cancel'],
                  ['continue', 'gopro']
                ]
              );

            });

          };

        }).catch(() => {

          if(verbose) {
            this.showPrompt(
              'unable to restore purchase.', 
              'Your purchase cannot be verified at this time. Please try again and/or check your original transaction was successful.', 
              [
                ['continue', 'continue']
              ]
            );
          };

        });

      }
      else {

        this.showPrompt(
          'download the app!', 
          `Only ${this.limit} free games are supported online. Please download the knobs app to play all levels.`,
          [
            ['close', 'continue']
          ]
        );

      };
    });
    
  };
  limit = 10;
};
