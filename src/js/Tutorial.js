import { createNode, createButton } from '@jamesrock/rockjs';
import { Puzzle } from './Puzzle';
import { Home } from './Home';
import { Screen } from './Screen';
import { storage } from './utils';

export class Tutorial extends Screen {
  constructor() {
    
    super();
    this.render();

  };
  render() {

    this.node = createNode('div', 'tutorial-screen');
    const prompt = this.prompt = createNode('div', 'prompt');
    const nextButton = this.nextButton = createButton('next', 'next');
    const closeButton = createButton('close', 'close');
    const promptBody = this.promptBody = createNode('div', 'prompt-body');
    const promptFoot = createNode('div', 'prompt-foot');

    this.node.innerHTML = `\
      <h1>knobs tutorial</h1>\
      <div id="board"></div>\
    `;

    nextButton.addEventListener('click', () => {
      
      if(this.completed) {
        this.destroy();
        new Home();
      }
      else {
        this.next();
      };
      
    });

    closeButton.addEventListener('click', () => {
      this.destroy();
      new Home();
    });

    this.target.appendChild(this.node);
    this.node.appendChild(this.prompt);

    prompt.appendChild(promptBody);
    prompt.appendChild(promptFoot);
    promptFoot.appendChild(closeButton);
    promptFoot.appendChild(nextButton);

    this.startNewGame();
    this.showPrompt();

  };
  showPrompt() {

    this.promptBody.innerText = this.prompts[this.tutorial][1][this.step][0];
    return this;

  };
  next() {

    this.prompts[this.tutorial][1][this.step][1].forEach(([action, items]) => {
      items.forEach((index) => {
        this.puzzle.tiles[index][action]();
      });
    });
    
    this.puzzle.updateStates();

    if(this.tutorial === this.prompts.length-1 && this.step === this.prompts[this.tutorial][1].length-2) {
      this.nextButton.innerText = 'done';
      this.completed = true;
    };

    if(this.step < this.prompts[this.tutorial][1].length-1) {
      this.step ++;
    }
    else if(this.tutorial < this.prompts.length-1) {
      this.step = 0;
      this.tutorial ++;
      this.startNewGame();
    };

    this.showPrompt();
    
    return this;

  };
  startNewGame() {

    this.removeOld();

    this.puzzle = new Puzzle('#board', this.solvedHandler.bind(this), this.prompts[this.tutorial][0]);

    return this;

  };
  removeOld() {
    
    if(this.puzzle) {
      this.puzzle.destroy();
    };

    return this;

  };
  solvedHandler = (force = false) => {
    if(force) {
      storage.set('stats', {
        ...storage.get('stats'),
        game: 10
      });
      this.destroy();
      new Home();
    };
  };
  completed = false;
  step = 0;
  tutorial = 0;
  prompts = [
    [
      0, 
      [
        ["Knobs is a game of logic. If you're familiar with 'Star Battle' or 'Two Not Touch' from NYT Games, this should be easy enough. Otherwise, let's get you up to speed...", []],
        ["The aim of the game is to twist (disable) knobs until only one of each colour remain active...", []],
        ["There are only two rules: knobs must not directly neighbour one another, and are limited to one per line horizontally and vertically...", []],
        ["There are several techniques to solving these puzzles. By far the most common is to identify a sequence of one colour, confined to one line, and disable all other knobs on the same line...", [
          ['highlight', [2, 10, 5, 6, 7]]
        ]],
        ["There are straight-up two examples here: BLUES and ORANGES...", []],
        ["Since there must be at least one BLUE and one ORANGE, and each knob can only occupy one line, we can safely disable any other knobs on those lines...", [
          ['unhighlight', [5, 6, 7]],
          ["disable", [0, 1, 2, 3, 4, 18, 26, 34, 42, 50, 58]]
        ]],
        ["This leaves one BLUE, and since knobs cannot have any direct neighbours, and (again) can only occupy one line, we can go ahead and clear everything up, down, left, right and around...", [
          ['unhighlight', [10]],
          ["disable", [8, 9, 11, 12, 13, 14, 15, 17, 19]],
          ['highlight', [27, 28]]
        ]],
        ["This leaves two YELLOWS in isolation on a single row. As such, we can go ahead and clear any knobs either side...", [
          ['unhighlight', [27, 28]],
          ["disable", [24, 25, 29, 30, 31]],
          ['highlight', [16]]
        ]],
        ["This leaves a single PURPLE in the leftmost column, so we can clear in all directions from there too — up, down, left, right and around...", [
          ['unhighlight', [16]],
          ["disable", [32, 40, 48, 56, 20, 21, 22, 23]],
          ['highlight', [57, 59, 60, 61, 62, 63]]
        ]],
        ["There are now no isolated lines to help us clear other knobs, but check the bottom row, see it's all BLUES?...", []],
        ["Well, since there must be one knob in this row, and it must be BLUE, all other BLUES not on this row may be disabled...", [
          ['unhighlight', [57, 59, 60, 61, 62, 63]],
          ["disable", [49, 52, 53, 54, 55]],
          ['highlight', [36, 37, 38, 39, 44, 45, 46, 47]]
        ]],
        ["Now for a new technique. See the two blocks of 4 beside one another?..", []],
        ["Well, since there must be one of each colour within each block, each occupying its own line, we can safely clear any knobs either side of those rows...", [
          ['unhighlight', [36, 37, 38, 39, 44, 45, 46, 47]],
          ["disable", [33, 41, 35, 43]],
          ['highlight', [51]]
        ]],
        ["This leaves one PINK. As such, we can clear up, down, left, right and around...", [
          ['unhighlight', [51]],
          ["disable", [27, 59, 60, 44]],
          ['highlight', [28]]
        ]],
        ["This leaves one YELLOW, so gain, let's clear up, down, left, right and around...", [
          ['unhighlight', [28]],
          ["disable", [36, 37]],
          ['highlight', [45]]
        ]],
        ["Which leaves one RED, so again, we clear in all directions and around...", [
          ['unhighlight', [45]],
          ["disable", [5, 46, 47, 38, 61]],
          ['highlight', [39]]
        ]],
        ["And now one GREEN...", [
          ['unhighlight', [39]],
          ["disable", [7, 63]],
          ['highlight', [62]]
        ]],
        ["Which ultimately leaves one of two CYAN knobs on the bottom row, clashing with the only ORANGE on the top row...", [
          ['unhighlight', [62]],
          ["disable", [62]]
        ]],
        ["And we're done! Only 8 knobs remain — one of each colour — and the puzzle is solved...", []],
        ["We can try another board if you're still not sure? Otherwise, tap close to return home.", []]
      ]
    ],
    [
      48, 
      [
        ["Okay. Let's cover a couple more techniqies...", [
          ['highlight', [15]]
        ]],
        ["Right away there's a YELLOW singleton, so we can clear up, down, left, right and around...", [
          ['unhighlight', [15]],
          ['disable', [14, 13, 12, 11, 10, 9, 8, 6, 7, 22, 23, 31, 39, 47, 55, 63]],
          ['highlight', [25, 33]]
        ]],
        ["There's also two isolated ORANGES, so let's go ahead and clear everything else in that line...", [
          ['unhighlight', [25, 33]],
          ['disable', [1, 17, 41, 49, 57]],
          ['highlight', [2]]
        ]],
        ["This leaves a single PURPLE, so let's go ahead and clear in all directions & around...", [
          ['unhighlight', [2]],
          ['disable', [0, 3, 4, 5, 18, 26, 34, 42, 50, 58]],
          ['highlight', [20, 28]]
        ]],
        ["That's reduced the BLUES down to a single line, so everything else in the same line can go...", [
          ['unhighlight', [20, 28]],
          ['disable', [36, 44, 52, 60]],
          ['highlight', [56, 59, 61, 62]]
        ]],
        ["Now, again, notice the bottom row is all BLUES — as such, all other BLUES may be safely removed...", [
          ['unhighlight', [56, 59, 61, 62]],
          ['disable', [48, 51, 53]],
          ['highlight', [54]]
        ]],
        ["Notice there's only one GREEN in the second to last row — as such, all other GREENS may be removed...", [
          ['disable', [45, 46, 29, 21]],
        ]],
        ["Which conveniently leaves one GREEN, so let's clear in all directions and around...", [
          ['unhighlight', [54]],
          ['disable', [38, 30, 62, 61]],
          ['highlight', [37]]
        ]],
        ["Spot the lonely PINK in the 6th column? Since this column contains only one knob, any other knobs of the same colour may be removed...", [
          ['disable', [43]],
        ]],
        ["Now there's only one PINK, so let's clear any neighbouring knobs and all other directions...", [
          ['unhighlight', [37]],
          ['disable', [35, 33, 32, 28]],
          ['highlight', [25]]
        ]],
        ["Which leaves one ORANGE, so let's clear anything clashing with that...", [
          ['unhighlight', [25]],
          ['disable', [24, 16, 27]],
          ['highlight', [19]]
        ]],
        ["There's a direct neighbour to the only remaining BLUE to be removed...", [
          ['disable', [19]],
          ['highlight', [56]]
        ]],
        ["Which leaves this CYAN knob clashing with the (only) RED above, so let's remove it...", [
          ['disable', [56]],
        ]],
        ["And that's another board completed! Now with the basics under your belt, you're perfectly equipped to solve any puzzle, picking-up other strategies along the way.", []]
      ]
    ]
  ];
};
