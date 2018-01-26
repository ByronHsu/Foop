import key from 'keymaster';
import { Box, Coin, Shoe, Trap, Pill, Bug } from './entity.js';
import { isCollided, isExceed } from './physic.js';
import { rnGen, rnGenInt } from './utils.js';
import dat from 'dat.gui';
const gui = new dat.GUI();

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
    this.player.hp = 100;
    this.player.speed = SPEED;
    this.player.money = 0;
    gui.add(this.player, 'hp', 0, 200).listen();
    gui.add(this.player, 'speed', 0, 50).listen();
    gui.add(this.player, 'money', 0, 200).listen();
    this.exit = new Box(exitBox);
    this.loop = new Box(loopBox);
    this.objs = [];
  }
  playerMove() {
    let arr = [
      { key: 'w', x: 0, y: -1 },
      { key: 's', x: 0, y: 1 },
      { key: 'a', x: -1, y: 0 },
      { key: 'd', x: 1, y: 0 },
    ];
    arr.forEach(obj => {
      if (key.isPressed(obj.key)) {
        let tmp = new Box(this.player);
        tmp.x += this.player.speed * obj.x;
        tmp.y += this.player.speed * obj.y;
        if (!isExceed(tmp, this.loop)) {
          this.player.x += this.player.speed * obj.x;
          this.player.y += this.player.speed * obj.y;
        }
      }
    });
  }
  collideExit() {
    let start = { x: -150, y: -150 };
    if (isCollided(this.player, this.exit) === true) {
      (this.player.x = start.x), (this.player.y = start.y);
    }
  }
  collideObjs() {
    // 要從後面刪回來，不然如果直接刪掉，i++，會跳過一個obj
    for (let i = this.objs.length - 1; i >= 0; i--) {
      if (isCollided(this.player, this.objs[i])) {
        this.objs[i].collide(this.player);
        this.objs.splice(i, 1);
      }
    }
  }
  randomGenObjs() {
    // 持續保持5個在場面上
    while (this.objs.length < 5) {
      let args = {
        x: rnGen(-loopBox.width / 2, loopBox.width / 2),
        y: rnGen(-loopBox.height / 2, loopBox.height / 2),
        width: 50,
        height: 50,
      };
      let arr = [
        new Coin(args),
        new Shoe(args),
        new Trap(args),
        new Pill(args),
        new Bug(args),
      ];
      this.objs.push(arr[rnGenInt(0, 4)]);
    }
  }
}

export default DataMgr;
