import PixiMgr from './pixiMgr';
import './scss/index.scss';
import key from 'keymaster';
import { Box, Coin, Shoe, Trap, Potion, Border, Door } from './js/entity.js';
import { inside, outside, hit, hitLaser } from './js/physic.js';
import { rnGen, rnGenInt } from './js/utils.js';
import dat from 'dat.gui';

if (process.env.NODE_ENV !== 'prod') {
  require('./template.html');
}
let gui = new dat.GUI();
const SPEED = 5;
const SPEEDUP = 0.5;
const WW = window.innerWidth;
const WH = window.innerHeight;
const PLAYERBOX = {
  x: 0,
  y: 0,
  width: 100,
  height: 100,
};
const LASERBOX = {
  x: -1 * WW / 2,
  y: -1 * WH / 2,
  width: 0,
  height: 100,
};

var pixiMgr = new PixiMgr();

class Looper {
  constructor() {
    this.arr = [];
    this.vec = []; // 儲存每一層的邊框
    this.now = 0;
    this.stack = [2];
    this.skip = 2;
    gui.add(this, 'now').listen();
    gui
      .add(this, 'skip', 0, 5)
      .step(1)
      .listen();
  }
  hitExitUp() {
    // 如果可以skip掉裡面的 就直接return這層的startUpBox
    if (this.skip == this.now) return this.arr[this.now].startDownBox;
    // 決定裡面那圈要走幾輪
    // 如果他已經是最裡面，就不用再push
    if (this.now !== 0) this.stack.unshift(2);
    // 不能 < 0
    this.now = this.now - 1 < 0 ? 0 : this.now - 1;
    // 回傳下個loop的startUpBox
    return this.arr[this.now].startUpBox;
  }
  hitExitDown() {
    let finish = false;
    this.stack[0]--;
    if (this.stack[0] === 0) {
      this.stack.splice(0, 1);
      finish = true;
    }
    // 如果這層完成了
    if (finish === true) {
      if (this.stack.length === 0) {
        // 開新世界
        this.now = this.now + 1;
        this.createLoop((this.now * 2 + 1) * WH);
        this.stack.unshift(2);
        return this.arr[this.now].startDownBox;
      } else {
        // 繼續走下個loop
        this.now = this.now + 1;
        return this.arr[this.now].startDownBox;
      }
    } else {
      // 如果還沒完成
      // 回到這層的頭
      return this.arr[this.now].startUpBox;
    }
  }
  createLoop(height) {
    let pad = 100;
    let obj = { border: new Border({ height, z: -this.now }) };
    let prevLoop = this.arr[this.now - 1];
    let frameUp = new Box({ x: 0, y: this.now * WH, width: WW, height: WH });
    let frameDown = new Box({ x: 0, y: -this.now * WH, width: WW, height: WH });
    if (height === WH)
      //最裡面
      this.vec.push({ border: frameUp, objs: [], idx: this.now });
    else
      this.vec.unshift({ border: frameUp, objs: [], idx: this.now }),
        this.vec.push({ border: frameDown, objs: [], idx: this.now });
    obj.startUpBox = new Door({
      x: obj.border.vtx[0].x + pad,
      y: obj.border.vtx[0].y + pad,
    });
    if (prevLoop !== undefined) {
      obj.startDownBox = new Door({
        x: prevLoop.border.vtx[3].x + pad,
        y: prevLoop.border.vtx[3].y + pad,
      });
      obj.exitUpBox = new Door({
        x: prevLoop.border.vtx[1].x - pad,
        y: prevLoop.border.vtx[1].y - pad,
      });
    }
    obj.exitDownBox = new Door({
      x: obj.border.vtx[2].x - pad,
      y: obj.border.vtx[2].y - pad,
    });
    let arr = [
      obj.startUpBox,
      obj.startDownBox,
      obj.exitUpBox,
      obj.exitDownBox,
    ];
    arr.forEach(val => {
      // Doors
      if (val !== undefined) pixiMgr.addDoor(val, this.now);
    });
    pixiMgr.addTile(obj.border);
    this.arr.push(obj);
  }
  get prevLoop() {
    return this.arr[this.now - 1];
  }
  get loop() {
    return this.arr[this.now];
  }
  get backLoop() {
    return this.arr[this.arr.length - 1];
  }
}

class DataMgr {
  constructor() {
    this.isPaused = false;
    this.player = new Box(PLAYERBOX);
    this.player.hp = 100;
    this.player.speed = SPEED;
    this.player.money = 0;
    gui.add(this.player, 'hp', 0, 200).listen();
    gui
      .add(this.player, 'speed', 0, 50)
      .step(1)
      .listen();
    this.looper = new Looper();
    this.looper.createLoop(WH);
    this.laser = new Box(LASERBOX);
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
        if (
          inside(tmp, this.looper.loop.border) &&
          ((this.looper.prevLoop !== undefined &&
            outside(tmp, this.looper.prevLoop.border)) ||
            this.looper.prevLoop === undefined)
        ) {
          this.player.x +=
            (this.player.speed + this.looper.arr.length * SPEEDUP) * obj.x;
          this.player.y +=
            (this.player.speed + this.looper.arr.length * SPEEDUP) * obj.y;
        }
      }
    });
  }
  hitExit() {
    if (hit(this.player, this.looper.loop.exitDownBox)) {
      let ret = this.looper.hitExitDown();
      (this.player.x = ret.x), (this.player.y = ret.y);
      (this.laser.x = -250), (this.laser.y = ret.y - 100);
      this.laser.width = 0;
    }
    if (hit(this.player, this.looper.loop.exitUpBox)) {
      let ret = this.looper.hitExitUp();
      (this.player.x = ret.x), (this.player.y = ret.y);
      (this.laser.x = -250), (this.laser.y = ret.y - 100);
      this.laser.width = 0;
    }
  }
  hitObjs() {
    // 要從後面刪回來，不然如果直接刪掉，i++，會跳過一個obj
    for (let i = 0; i < this.looper.vec.length; i++) {
      let loop = this.looper.vec[i];
      for (let j = loop.objs.length - 1; j >= 0; j--) {
        if (hit(this.player, loop.objs[j])) {
          loop.objs[j].hit(this.player);
          loop.objs.splice(j, 1);
        }
      }
    }
  }
  hitLaser() {
    if (hitLaser(this.player, this.laser)) {
      pixiMgr.isPaused = true;
      pixiMgr.shouldReset = true;
    }
  }
  randomGenObjs() {
    for (let i = 0; i < this.looper.vec.length; i++) {
      let loop = this.looper.vec[i];
      while (loop.objs.length < 5) {
        let args = {
          x: rnGen(-loop.border.width / 2, loop.border.width / 2),
          y: rnGen(
            -loop.border.height / 2 + loop.border.y,
            loop.border.height / 2 + loop.border.y
          ),
          width: 50,
          height: 50,
          idx: loop.idx,
        };
        let arr = [
          new Coin(args),
          new Shoe(args),
          new Trap(args),
          new Potion(args),
        ];
        loop.objs.push(arr[rnGenInt(0, 3)]);
      }
    }
    // console.log(this.looper.vec);
  }
  get objs() {
    let arr = [];
    this.looper.vec.forEach(loop => {
      arr = arr.concat(loop.objs);
    });
    console.log('get objs', arr);
    return arr;
  }
}

var dataMgr = new DataMgr();
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    pixiMgr.isPaused = true;
    pixiMgr.worldCtn.alpha = 0.5;
  }
});

function animate() {
  if (!pixiMgr.isPaused) {
    dataMgr.playerMove();
    dataMgr.randomGenObjs();
    dataMgr.hitExit();
    dataMgr.hitObjs();
    dataMgr.hitLaser();
    pixiMgr.updatePlayer(dataMgr.player);
    pixiMgr.updateObjs(dataMgr.objs);
    pixiMgr.updateLaser(dataMgr.laser, dataMgr.looper.arr.length * SPEEDUP);
    // dataMgr.player.speed > 10 ? pixiMgr.shine() : pixiMgr.unShine();
    requestAnimationFrame(animate);
  } else {
    // stop pixi animations
    // ex. pixiMgr.animationsStop();
    if (pixiMgr.shouldReset) {
      pixiMgr.reset();
      gui.destroy();
      gui = new dat.GUI();
      dataMgr = new DataMgr();
    }
    requestAnimationFrame(animate);
  }
}
pixiMgr.setup().then(() => {
  requestAnimationFrame(animate);
});
