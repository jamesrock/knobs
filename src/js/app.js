import { Builder } from './Builder';
import { Home } from './Home';
import { Checker } from './Checker';
import { Icon } from './Icon';
import { SubscriptionService } from './SubscriptionService';
import { storage } from './utils';

const stats = storage.get('stats');
const mode = 'play'; // 'check', 'icon', 'build', 'play'

const setStats = window.resetStats = () => {
  storage.set('stats', {
    game: 0,
    best: 0
  });
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

document.addEventListener('deviceready', () => {
  
  console.log('deviceready');
  const service = new SubscriptionService();
  console.log('hasActiveSubscription', service.hasActiveSubscription());

});