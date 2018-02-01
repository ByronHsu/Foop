import * as PIXI from 'pixi.js';
import '../bin/pixi-display.js';

const WW = window.innerWidth;
const WH = window.innerHeight;

class PixiMgr {
  constructor() {
    // init app
    this.app = new PIXI.Application({
      width: WW,
      height: WH,
      antialias: true,
      backgroundColor: 0xb4b4b4,
    });
    document.querySelector('#game').appendChild(this.app.view);
    this.app.stage = new PIXI.display.Stage();
    this.app.stage.group.enableSort = true;
    this.app.renderer.view.style.position = 'absolute';
    this.app.renderer.view.style.display = 'block';
    this.app.renderer.autoResize = true;
    this.app.renderer.resize(window.innerWidth, window.innerHeight);

    // init ctn: world, player, objs, back, laser
    this.worldCtn = new PIXI.Container();
    (this.worldCtn.x = WW / 2), (this.worldCtn.y = WH / 2);
    this.playerCtn = new PIXI.Container();
    this.objsCtn = new PIXI.Container();
    this.backCtn = new PIXI.Container();
    this.laserCtn = new PIXI.Container();
    this.app.stage.addChild(this.worldCtn);
    this.worldCtn.addChild(this.playerCtn);
    this.worldCtn.addChild(this.objsCtn);
    this.worldCtn.addChild(this.backCtn);
    this.worldCtn.addChild(this.laserCtn);
    this.mapCtn = new PIXI.Container();
    (this.mapCtn.x = WW - 200), (this.mapCtn.y = WH / 2);
    this.app.stage.addChild(this.mapCtn);

    // init group: player, objs, back
    this.backGrp = new PIXI.display.Group(0, true);
    this.objsGrp = new PIXI.display.Group(1, true);
    this.playerGrp = new PIXI.display.Group(2, true);
    this.laserGrp = new PIXI.display.Group(3, true);
    this.mapGrp = new PIXI.display.Group(4, true);
    let arr = [
      this.backGrp,
      this.objsGrp,
      this.playerGrp,
      this.laserGrp,
      this.mapGrp,
    ];
    // sprite.z 越大在越上面
    arr.forEach(g => {
      g.on('sort', sprite => {
        sprite.zOrder = -sprite.z;
      });
    });
    this.app.stage.addChild(new PIXI.display.Layer(this.backGrp));
    this.app.stage.addChild(new PIXI.display.Layer(this.objsGrp));
    this.app.stage.addChild(new PIXI.display.Layer(this.playerGrp));
    this.app.stage.addChild(new PIXI.display.Layer(this.laserGrp));
    this.app.stage.addChild(new PIXI.display.Layer(this.mapGrp));
    // init displayObjects reference
    this.player = {};
    this.objs = [];
    this.loopRef = [];
    this.exitRef = [];
    this.laserRef = {};
    this.laser, this.pause;
    this.laserEnd = 0;
    this.isPaused = false;
    this.shouldReset = false;
    this.playerMap = {};
  }
  setup() {
    // Load resources
    return new Promise(resolve => {
      PIXI.loader
        .add(['../assets/laser.png', '../assets/pause.png'])
        .add('../assets/images/wan.json')
        .add('../assets/images/coin.json')
        .load(() => {
          this.setupPlayer();
          this.setupLaser();
          this.setupPause();
          this.setupGameOverScene();
          resolve();
        });
    });
  }
  updatePlayer({ x, y }) {
    this.player.x = x;
    this.player.y = y;
    this.worldCtn.pivot.set(0, y);
    this.playerMap.x = x / 10;
    this.playerMap.y = y / 10;
  }
  updateObjs(objs) {
    // remove deleted obj from container
    // 1. iterate this.objsCtn
    // 2. 看傳進來的objs有無這個item
    // 3. 若沒有則表示他已不存在 => 刪除
    let length = this.objsCtn.children.length;
    for (let i = length - 1; i >= 0; i--) {
      let child = this.objsCtn.children[i];
      let x = objs.findIndex(obj => obj.id === child.id);
      if (x === -1) {
        //找不到
        this.objsCtn.removeChild(child);
        this.objs.splice(i, 1);
      }
    }
    // add new objs into container
    // 1. iterate objs
    // 2. 看this.objsCtn中有沒有這個obj
    // 3. 若沒有，則加進去
    for (let i = 0; i < objs.length; i++) {
      let x = this.objs.findIndex(obj => obj.id === objs[i].id);
      if (x !== -1) continue;
      let sprite = this.addSprite(objs[i]);
      this.objs.push(sprite);
    }
  }
  updateLaser(laser, speedUp) {
    if (laser.width < WW) {
      this.laserRef.width = laser.width += 50;
      this.laserRef.y = laser.y;
      this.laserEnd = laser.y + WH;
    } else if (laser.y < this.laserEnd) {
      this.laserRef.y = laser.y += 1.5 + speedUp;
    }
  }
  addTile(border) {
    // tiles' z value is negative, modulo 4 to loop from 4 imgs
    let idx = Math.abs(border.z) % 4;
    let arr = ['tile-glass', 'tile-gold', 'tile-grass', 'tile-red'];
    let sprite = new PIXI.extras.TilingSprite.fromImage(
      `../assets/${arr[idx]}.png`
    );
    sprite.anchor.set(0.5, 0.5);
    sprite.parentGroup = this.backGrp;
    this.backCtn.addChild(Object.assign(sprite, border));

    // for map
    let spriteMap = new PIXI.extras.TilingSprite.fromImage(
      `../assets/${arr[idx]}.png`
    );
    spriteMap.anchor.set(0.5, 0.5);
    spriteMap.parentGroup = this.mapGrp;
    spriteMap = Object.assign(spriteMap, border);
    (spriteMap.width /= 10), (spriteMap.height /= 10);
    this.mapCtn.addChild(spriteMap);
  }
  addSprite(obj) {
    let sprite;
    if (obj.type === 'coin') {
      let tex = [];
      for (let i = 0; i < 3; i++) {
        let coinTex = PIXI.Texture.fromFrame(`coin${i}.png`);
        tex.push(coinTex);
      }
      sprite = new PIXI.extras.AnimatedSprite(tex);
      sprite.animationSpeed = 0.3;
      sprite.play();
      sprite.tint = 0x0072d3;
    } else sprite = new PIXI.Sprite.fromImage(`../assets/${obj.img}.png`);

    sprite.anchor.set(0.5, 0.5);
    if (obj.group === 'back') {
      sprite.parentGroup = this.backGrp;
      this.backCtn.addChild(Object.assign(sprite, obj));
    } else {
      sprite.parentGroup = this.objsGrp;
      this.objsCtn.addChild(Object.assign(sprite, obj));
    }
    return sprite;
  }
  shine() {
    this.player.play();
  }
  unShine() {
    this.player.gotoAndStop(0);
  }
  // dummy function
  setupPlayer() {
    let wans = [];
    for (let i = 0; i < 3; i++) {
      let wanTex = PIXI.Texture.fromFrame(`wan${i}.png`);
      wans.push(wanTex);
    }
    let wan = new PIXI.extras.AnimatedSprite(wans);
    wan.anchor.set(0.5, 0.5);
    (wan.width = 100), (wan.height = 100);
    (wan.x = 0), (wan.y = 0);
    wan.parentGroup = this.playerGrp;
    this.player = wan;
    this.playerCtn.addChild(this.player);

    this.playerMap = new PIXI.Sprite.fromImage('../assets/reddot.png');
    this.playerMap.anchor.set(0.5, 0.5);
    (this.playerMap.width = this.player.width / 5),
      (this.playerMap.height = this.player.height / 5);
    this.playerMap.z = 1;
    this.playerMap.parentGroup = this.mapGrp;
    this.mapCtn.addChild(this.playerMap);
  }
  setupLaser() {
    this.laser = new PIXI.Sprite(
      PIXI.loader.resources['../assets/laser.png'].texture
    );
    this.laser.anchor.set(0, 0.5);
    (this.laser.width = 0), (this.laser.height = 100);
    this.laser.position.set(-1 * WW / 2, -1 * WH);
    this.laser.parentGroup = this.laserGrp;
    this.laserRef = this.laser;
    this.laserCtn.addChild(this.laser);
  }
  setupPause() {
    this.pause = new PIXI.Sprite(
      PIXI.loader.resources['../assets/pause.png'].texture
    );
    this.pause.anchor.set(0.5);
    (this.pause.width = 50), (this.pause.height = 50);
    this.pause.position.set(100, 0);
    this.pause.interactive = true;
    this.pause.buttonMode = true;
    this.pause.z = 2;
    this.pause.on('click', () => {
      this.isPaused = !this.isPaused;
      this.worldCtn.alpha = this.isPaused ? 0.5 : 1;
    });
    this.pause.parentGroup = this.mapGrp;
    this.mapCtn.addChild(this.pause);
  }
  setupGameOverScene() {
    // this.gameOverScene = new PIXI.Container();
    // this.gameOverScene.visible = false;
    // let endMsg = new PIXI.Sprite.fromImage(`../assets/door1.png`);
    // endMsg.x = this.app.renderer.view.width / 2;
    // endMsg.y = this.app.renderer.view.height / 2;
    // endMsg.interactive = true;
    // endMsg.buttonMode = true;
    // endMsg.on('click', this.restart.bind(this));
    // this.gameOverScene.addChild(endMsg);
    // this.gameOverScene.visible = false;
    // this.app.stage.addChild(this.gameOverScene);
  }
  reset() {
    // temporary function
    this.playerCtn.removeChildren();
    this.objsCtn.removeChildren();
    this.backCtn.removeChildren();
    this.mapCtn.removeChildren();
    this.laserCtn.removeChildren();
    let gameCtn = new PIXI.Container();
    gameCtn.addChild(new PIXI.Sprite.fromImage('../assets/gameover.png'));
    this.app.stage.addChild(gameCtn);
    this.setupPause();
    this.pause.on('click', () => {
      this.isPaused = false;
      this.worldCtn.visible = true;
      this.setupPlayer();
      this.setupLaser();
      this.setupGameOverScene();
      this.setupPause();
      this.app.stage.removeChild(gameCtn);
    });
    this.shouldReset = false;
    this.worldCtn.visible = false;
  }
}

export default PixiMgr;
