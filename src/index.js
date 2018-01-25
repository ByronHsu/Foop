import DataMgr from './js/DataMgr';
import PixiMgr from './js/PixiMgr';
// Import eventemitter3 from 'eventemitter3';

const dataMgr = new DataMgr();
const pixiMgr = new PixiMgr();

pixiMgr.generateObjs(dataMgr.objs);
function animate() {
  pixiMgr.updatePlayer(dataMgr.player);
  dataMgr.collideExit();
  dataMgr.playerMove();
  pixiMgr.destroyObjs(dataMgr.destroyId);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
