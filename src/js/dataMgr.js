import key from 'keymaster';
import { Box } from './entity.js';
import { isCollided, isExceed } from './physic.js';

const SPEED = 5;
const playerBox = {
  x: 0,
  y: 0,
  width: 100,
  height: 100,
};
const exitBox = {
  x: 250,
  y: 250,
  width: 50,
  height: 50,
};
const loopBox = {
  x: 0,
  y: 0,
  width: 500,
  height: 500,
};

class DataMgr {
  constructor() {
    this.player = new Box(playerBox);
    (this.player.hp = 100), (this.player.speed = SPEED);
    this.exit = new Box(exitBox);
    this.loop = new Box(loopBox);
  }
  bindKey() {
    let arr = [
      { key: 'w', x: 0, y: -1 },
      { key: 's', x: 0, y: 1 },
      { key: 'a', x: -1, y: 0 },
      { key: 'd', x: 1, y: 0 },
    ];
    arr.forEach(obj => {
      key(obj.key, () => {
        let tmp = new Box(this.player);
        tmp.x += this.player.speed * obj.x;
        tmp.y += this.player.speed * obj.y;
        if (!isExceed(tmp, this.loop)) {
          this.player.x += this.player.speed * obj.x;
          this.player.y += this.player.speed * obj.y;
        }
      });
    });
  }
  collideExit() {
    let start = { x: -150, y: -150 };
    if (isCollided(this.player, this.exit) === true) {
      (this.player.x = start.x), (this.player.y = start.y);
    }
  }
}

export default DataMgr;
