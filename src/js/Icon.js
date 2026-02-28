import { makeNode } from '@jamesrock/rockjs';
import { Screen } from './Screen';

export class Icon extends Screen {
  constructor() {

    super();
    this.render();

  };
  render() {

    this.node = makeNode('div', 'icon-screen');
    this.target.appendChild(this.node);

    const icon = makeNode('div', 'icon');
    const gap = 8;
    const size = 42;
    const bob = (size * 2) + (gap);
    const scale = 10;
    const border = 8;

    this.node.appendChild(icon);

    icon.style.width = icon.style.height = `${bob}px`;
    icon.style.position = 'relative';
    icon.style.transform = `scale(${scale})`;
    icon.style.border = `solid ${gap}px var(--background)`;
    icon.style.backgroundColor = 'var(--background)';

    document.body.style.backgroundColor = 'red';

    this.knobs.forEach((tile, index) => {

      const knob = makeNode('div', 'knob');
      knob.style.top = `${(tile.y * size) + (gap * tile.y)}px`;
      knob.style.left = `${(tile.x * size) + (gap * tile.x)}px`;
      knob.style.width = `${size}px`;
      knob.style.height = `${size}px`;
      knob.style.borderWidth = `${border}px`;
      knob.dataset.state = tile.state;
      knob.dataset.index = index;
      knob.dataset.box = tile.b;
      icon.appendChild(knob);

    });

  };
  knobs = [
    {x: 0, y: 0, b: 4, state: 'on'},
    {x: 1, y: 0, b: 7, state: 'on'},
    {x: 0, y: 1, b: 0, state: 'on'},
    {x: 1, y: 1, b: 0, state: 'off'}
  ];
};
