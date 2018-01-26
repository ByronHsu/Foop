import DataMgr from './js/DataMgr';
import * as pixiMgr from './js/PixiMgr';
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
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
