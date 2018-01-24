import key from 'keymaster';
import { Box } from './entity.js';
import { isCollided, isExceed } from './physic.js';

const SPEED = 5;

class DataMgr {
  constructor() {
    this.player = {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      hp: 100,
      speed: SPEED,
    };
    this.exit = {
      x: 250,
      y: 250,
      width: 50,
      height: 50,
    };
    this.border = {
      x: 0,
      y: 0,
      width: 500,
      height: 500,
    };
  }
  bindKey() {
    key('w', () => {
      let tmp = Object.assign({}, this.player);
      tmp.y -= this.player.speed;
      if (!isExceed(new Box(tmp), new Box(this.border)))
        this.player.y -= this.player.speed;
    });
    key('s', () => {
      let tmp = Object.assign({}, this.player);
      tmp.y += this.player.speed;
      if (!isExceed(new Box(tmp), new Box(this.border)))
        this.player.y += this.player.speed;
    });
    key('a', () => {
      let tmp = Object.assign({}, this.player);
      tmp.x -= this.player.speed;
      if (!isExceed(new Box(tmp), new Box(this.border)))
        this.player.x -= this.player.speed;
    });
    key('d', () => {
      let tmp = Object.assign({}, this.player);
      tmp.x += this.player.speed;
      if (!isExceed(new Box(tmp), new Box(this.border)))
        this.player.x += this.player.speed;
    });
  }
  collideExit() {
    let start = { x: -150, y: -150 };
    if (isCollided(new Box(this.player), new Box(this.exit)) === true) {
      (this.player.x = start.x), (this.player.y = start.y);
    }
  }
}

export default DataMgr;
