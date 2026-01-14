import { Builder } from './Builder';
import { Home } from './Home';
import { Checker } from './Checker';
import { Icon } from './Icon';
import { storage, colors } from './utils';

const stats = storage.get('stats');
const mode = 'build'; // 'check', 'icon', 'build', 'play'

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

if(mode==='build') {
  new Builder();
}
else if(mode==='check') {
  new Checker();
}
else if(mode==='icon') {
  new Icon();
}
else {
  new Home();
};

colors.forEach(([name, value], index) => {
  document.documentElement.style.setProperty(`--box-${index}`, value);
});
