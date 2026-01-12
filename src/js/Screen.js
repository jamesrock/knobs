export class Screen {
  constructor() {

    this.target = document.querySelector('#app');

  };
  destroy() {

    this.node.parentNode.removeChild(this.node);
		return this;

  };
};