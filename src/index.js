import DataMgr from './js/dataMgr';
import * as pixiMgr from './js/pixiMgr';
import './scss/index.scss';

if (process.env.NODE_ENV !== 'prod') {
  require('./template.html');
}

const dataMgr = new DataMgr();
pixiMgr.init();

function animate() {
  dataMgr.playerMove();
  dataMgr.randomGenObjs();
  dataMgr.collideExit();
  dataMgr.collideObjs();
  pixiMgr.updatePlayer(dataMgr.player);
  pixiMgr.updateObjs(dataMgr.objs);
  pixiMgr.updateLaser(dataMgr.laser);
  // dataMgr.player.speed > 10 ? pixiMgr.shine() : pixiMgr.unShine();
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
