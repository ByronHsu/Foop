import DataMgr from './js/DataMgr';
import PixiMgr from './js/PixiMgr';
// Import eventemitter3 from 'eventemitter3';

const dataMgr = new DataMgr();
const pixiMgr = new PixiMgr();
pixiMgr.randomCoin(dataMgr.coins);
dataMgr.bindKey();
function animate() {
  pixiMgr.updatePlayer(dataMgr.player);
  dataMgr.collideExit();
  // dataMgr.collideObj();
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
