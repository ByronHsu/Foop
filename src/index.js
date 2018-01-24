import PixiMgr from './js/PixiMgr';
import DataMgr from './js/DataMgr';
// import eventemitter3 from 'eventemitter3';

var pixiMgr = new PixiMgr();
var dataMgr = new DataMgr();
dataMgr.bindKey();

function animate(timeStamp) {
  pixiMgr.updatePlayer(dataMgr.player);
  dataMgr.collideExit();
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
