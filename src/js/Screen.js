import { storage } from './utils';

export class Screen {
  constructor() {

    this.target = document.querySelector('#app');
    this.stats = storage.get('stats');

  };
  destroy() {

    this.node.parentNode.removeChild(this.node);
		return this;

  };
};