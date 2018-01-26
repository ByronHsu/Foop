import DataMgr from './js/DataMgr';
import PixiMgr from './js/PixiMgr';
import './scss/index.scss';

const dataMgr = new DataMgr();
const pixiMgr = new PixiMgr();

function animate() {
  dataMgr.playerMove();
  dataMgr.randomGenObjs();
  dataMgr.collideExit();
  dataMgr.collideObjs();
  pixiMgr.updatePlayer(dataMgr.player);
  pixiMgr.updateObjs(dataMgr.objs);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
