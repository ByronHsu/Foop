import DataMgr from './js/DataMgr';
import PixiMgr from './js/PixiMgr';
// Import eventemitter3 from 'eventemitter3';

const dataMgr = new DataMgr();
const pixiMgr = new PixiMgr();

pixiMgr.randomCoins(dataMgr.coins);
function animate() {
  pixiMgr.updatePlayer(dataMgr.player);
  dataMgr.collideExit();
  dataMgr.playerMove();
  pixiMgr.destroyCoins(dataMgr.destroyId);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
