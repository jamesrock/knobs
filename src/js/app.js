import { Builder } from './Builder';
import { Home } from './Home';
import { Checker } from './Checker';
import { Icon } from './Icon';
import { storage } from './utils';

const stats = storage.get('stats');
const mode = 'play'; // 'check', 'icon', 'build', 'play'

const setStats = window.resetStats = () => {
  storage.set('stats', {
    game: 0,
    best: 0
  });
  storage.set('pro', false);
  storage.set('history', [0, []]);
};

if(!stats) {
  setStats();
};

const screens = {
  play: () => {
    new Home();
  },
  build: () => {
    new Builder();
  },
  check: () => {
    new Checker();
  },
  icon: () => {
    new Icon();  
  }
};

screens[mode]();
