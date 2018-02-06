import PixiMgr from './pixiMgr';
import './scss/index.scss';
import 'pixi-sound';
import key from 'keymaster';
import { Box, Border, Door, Bug } from './js/entity';
import { inside, outside, hit, hitLaser } from './js/physic';
import { rnGen } from './js/utils';
import dat from 'dat.gui';
import * as config from './js/config';

if (process.env.NODE_ENV !== 'prod') {
  require('./template.html');
}

let gui = new dat.GUI();
const SPEED = 10;
const FALLSPEED = 5;
const SPEEDUP = 0;

const PLAYERBOX = {
  x: 0,
  y: 0,
  width: 100,
  height: 100,
};
const LASERBOX = {
  x: -1 * config.app.w / 2,
  y: -1 * config.app.h / 2 + 10,
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
    let vecIdx = -this.now + this.arr.length - 1;
    this.vec[vecIdx].hasBug = false;
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
    let vecIdx = this.now + this.arr.length - 1;
    this.vec[vecIdx].hasBug = false;
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
        this.createLoop((this.now * 2 + 1) * config.app.h);
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
    let frameUp = new Box({
      x: 0,
      y: -this.now * config.app.h,
      width: config.app.w,
      height: config.app.h,
    });
    let frameDown = new Box({
      x: 0,
      y: this.now * config.app.h,
      width: config.app.w,
      height: config.app.h,
    });
    if (height === config.app.h)
      //最裡面
      this.vec.push({
        border: frameUp,
        objs: [],
        idx: this.now,
        hasBug: false,
        hitBug: false,
      });
    else
      this.vec.unshift({
        border: frameUp,
        objs: [],
        idx: this.now,
        hasBug: false,
        hitBug: false,
      }),
        this.vec.push({
          border: frameDown,
          objs: [],
          idx: this.now,
          hasBug: false,
          hitBug: false,
        });
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
    this.player.hp = 3;
    this.player.speed = SPEED;
    this.player.money = 0;
    this.player.exitTimes = 0; // increase every time player exits a door.
    gui
      .add(this.player, 'hp', 0, 200)
      .step(1)
      .listen();
    gui
      .add(this.player, 'speed', 0, 50)
      .step(1)
      .listen();
    this.looper = new Looper();
    this.looper.createLoop(config.app.h);
    this.laser = new Box(LASERBOX);
    this.player.onFloor = false;
    // this.objs = [];
  }
  playerMove() {
    let tmp = new Box(this.player);
    tmp.y += FALLSPEED;
    if (
      inside(tmp, this.looper.loop.border) &&
      ((this.looper.prevLoop !== undefined &&
        outside(tmp, this.looper.prevLoop.border)) ||
        this.looper.prevLoop === undefined)
    ) {
      this.player.y += FALLSPEED;
    } else this.hitFloor();
    // let arr = [{ key: 'a', x: -1, y: 0 }, { key: 'd', x: 1, y: 0 }];
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
  hitFloor() {
    if (!this.player.onFloor) {
      this.player.hp -= 1;
      this.player.onFloor = true;
      pixiMgr.sounds[4].sound.play();
    }
  }
  hitExit() {
    if (hit(this.player, this.looper.loop.exitDownBox)) {
      if (this.looper.vec[this.playerVec].hitBug) {
        this.looper.vec[this.playerVec].hitBug = false;
        this.player.exitTimes += 1;
        pixiMgr.sounds[3].sound.play();
        let ret = this.looper.hitExitDown();
        (this.player.x = ret.x), (this.player.y = ret.y);
        (this.laser.x = -250), (this.laser.y = ret.y - 100);
        this.laser.width = 0;
        this.player.onFloor = false;
      }
    } else if (hit(this.player, this.looper.loop.exitUpBox)) {
      if (this.looper.vec[this.playerVec].hitBug) {
        this.looper.vec[this.playerVec].hitBug = false;
        this.player.exitTimes += 1;
        pixiMgr.sounds[3].sound.play();
        let ret = this.looper.hitExitUp();
        (this.player.x = ret.x), (this.player.y = ret.y);
        (this.laser.x = -250), (this.laser.y = ret.y - 100);
        this.laser.width = 0;
        this.player.onFloor = false;
      }
    }
  }
  hitObjs() {
    // 要從後面刪回來，不然如果直接刪掉，i++，會跳過一個obj
    for (let i = 0; i < this.looper.vec.length; i++) {
      let loop = this.looper.vec[i];
      for (let j = loop.objs.length - 1; j >= 0; j--) {
        if (hit(this.player, loop.objs[j])) {
          loop.objs[j].hit(this.player);
          if (loop.objs[j].type === 'worm') {
            this.looper.vec[this.playerVec].hitBug = true;
            pixiMgr.sounds[2].sound.play();
          } else pixiMgr.sounds[1].sound.play();
          loop.objs.splice(j, 1);
        }
      }
    }
  }
  hitLaser() {
    if (hitLaser(this.player, this.laser)) {
      pixiMgr.sounds[0].sound.play();
      pixiMgr.isPaused = true;
      pixiMgr.shouldReset = true;
    }
  }
  noHp() {
    if (this.player.hp < 1) {
      pixiMgr.isPaused = true;
      pixiMgr.shouldReset = true;
    }
  }
  randomGenObjs() {
    for (let i = 0; i < this.looper.vec.length; i++) {
      let loop = this.looper.vec[i];
      // while (loop.objs.length < 5) {
      //   let args = {
      //     x: rnGen(-loop.border.width / 2, loop.border.width / 2),
      //     y: rnGen(
      //       -loop.border.height / 2 + loop.border.y,
      //       loop.border.height / 2 + loop.border.y
      //     ),
      //     width: 50,
      //     height: 50,
      //     idx: loop.idx,
      //   };
      //   let arr = [
      //     new Coin(args),
      //     new Shoe(args),
      //     new Trap(args),
      //     new Potion(args),
      //   ];
      //   loop.objs.push(arr[rnGenInt(0, 3)]);
      // }
      // 在這個vec才放蟲
      // console.log(this.playerVec, i, loop.hasBug);
      const pad = 100;
      if (i === this.playerVec && !loop.hasBug) {
        let bugArgs = {
          x: rnGen(-loop.border.width / 2 + pad, loop.border.width / 2 - pad),
          y: rnGen(
            loop.border.y + pad,
            // -loop.border.height / 2 + loop.border.y + pad, // 蟲出生位置太高會吃不到，暫時弄低一點
            loop.border.height / 2 + loop.border.y - pad
          ),
          width: 50,
          height: 50,
          idx: loop.idx,
        };
        loop.objs.push(new Bug(bugArgs));
        loop.hasBug = true;
      }
    }
    // console.log(this.looper.vec);
  }
  get objs() {
    let arr = [];
    this.looper.vec.forEach(loop => {
      arr = arr.concat(loop.objs);
    });
    // console.log('get objs', arr);
    return arr;
  }
  // get the frame 'x' the player now stands on. this.looper.vec[x]
  get playerVec() {
    let len = this.looper.vec.length;
    const { y } = this.player;
    // 距離(y - (-len / 2* config.app.h) )/邊長
    return Math.floor((y + len / 2 * config.app.h) / config.app.h);
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
    dataMgr.noHp();
    pixiMgr.updatePlayer(dataMgr.player);
    pixiMgr.updateObjs(dataMgr.objs);
    pixiMgr.updateLaser(dataMgr.laser, FALLSPEED);
    // dataMgr.player.speed > 10 ? pixiMgr.shine() : pixiMgr.unShine();
    requestAnimationFrame(animate);
  } else {
    // stop pixi animations
    // ex. pixiMgr.animationsStop();
    if (pixiMgr.shouldReset) {
      pixiMgr.reset(dataMgr.player);
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
