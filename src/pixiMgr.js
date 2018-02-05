import * as PIXI from 'pixi.js';
import './bin/pixi-display';
import * as config from './js/config';

const WW = window.innerWidth;
const WH = window.innerHeight;
const id = PIXI.loader.resources;

class PixiMgr {
  constructor() {
    // init app
    this.app = new PIXI.Application({
      width: WW,
      height: WH,
      antialias: true,
      backgroundColor: config.bgColor,
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
    this.sounds = []; // store all sound objects
  }
  setup() {
    // Load resources
    return new Promise(resolve => {
      PIXI.loader
        .add(config.imgUrl)
        .add(config.jsonUrl)
        .add(config.soundsUrl)
        .load(() => {
          this.setupPlayer();
          this.setupLaser();
          this.setupPause();
          this.setupSound();
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
    // console.log('in', objs);
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
      let sprite = this.addObj(objs[i]);
      this.objs.push(sprite);
    }
    // console.log('out', objs);
  }
  updateLaser(laser) {
    if (laser.width < WW) {
      this.laserRef.width = laser.width += 50;
      this.laserRef.y = laser.y;
      this.laserEnd = laser.y + WH;
    } else if (laser.y < this.laserEnd) {
      this.laserRef.width = laser.width += 5;
    }
  }
  addTile(border) {
    const idx = Math.abs(border.z) % 7;
    let painter = new PIXI.Graphics();
    painter.beginFill(config.tileColor, 1);
    (painter.lineColor = config.lineColor[idx]), (painter.lineWidth = 10);
    painter.drawRect(0, 0, border.width, border.height);
    let sprite = new PIXI.Sprite(painter.generateCanvasTexture());
    sprite.anchor.set(0.5, 0.5);
    sprite.parentGroup = this.backGrp;
    this.backCtn.addChild(Object.assign(sprite, border));
    // for map
    painter.lineWidth = 40;
    painter.drawRect(0, 0, border.width, border.height);
    let spriteMap = new PIXI.Sprite(painter.generateCanvasTexture());
    spriteMap.anchor.set(0.5, 0.5);
    spriteMap.alpha = 0.5;
    spriteMap.parentGroup = this.mapGrp;
    spriteMap = Object.assign(spriteMap, border);
    (spriteMap.width /= 10), (spriteMap.height /= 10);
    this.mapCtn.addChild(spriteMap);
  }
  addObj(obj) {
    let sprite;
    let texs = [];
    let length = Object.keys(id[`./assets/images/${obj.type}.json`].textures)
      .length;
    for (let i = 0; i < length; i++) {
      let tex = PIXI.Texture.fromFrame(`${obj.type}${i}.png`);
      texs.push(tex);
    }
    sprite = new PIXI.extras.AnimatedSprite(texs);
    sprite.animationSpeed = 0.3;
    sprite.play();
    sprite.tint =
      obj.type === 'worm'
        ? config.lineColor[obj.idx + 1]
        : config.lineColor[obj.idx];
    sprite.anchor.set(0.5, 0.5);
    sprite.parentGroup = this.objsGrp;
    this.objsCtn.addChild(Object.assign(sprite, obj));
    return sprite;
  }
  addDoor(obj, idx) {
    let sprite = new PIXI.Sprite.fromImage(`./assets/${obj.img}.png`);
    sprite.anchor.set(0.5, 0.5);
    sprite.tint = config.lineColor[idx];
    sprite.parentGroup = this.backGrp;
    this.backCtn.addChild(Object.assign(sprite, obj));
    return sprite;
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

    this.playerMap = new PIXI.Sprite.fromImage('./assets/reddot.png');
    this.playerMap.anchor.set(0.5, 0.5);
    (this.playerMap.width = this.player.width / 5),
      (this.playerMap.height = this.player.height / 5);
    this.playerMap.z = 1;
    this.playerMap.parentGroup = this.mapGrp;
    this.mapCtn.addChild(this.playerMap);
  }
  setupLaser() {
    this.laser = new PIXI.Sprite(id['./assets/laser.png'].texture);
    this.laser.anchor.set(0, 0.5);
    (this.laser.width = 0), (this.laser.height = 100);
    this.laser.position.set(-1 * WW / 2, -1 * WH);
    this.laser.parentGroup = this.laserGrp;
    this.laserRef = this.laser;
    this.laserCtn.addChild(this.laser);
  }
  setupPause() {
    this.pause = new PIXI.Sprite(id['./assets/pause.png'].texture);
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
  setupSound() {
    const { soundsUrl } = config;
    for (let i = 0; i < soundsUrl.length; i++) {
      this.sounds.push(id[soundsUrl[i]]);
    }
  }
  reset(player) {
    // temporary function
    this.playerCtn.removeChildren();
    this.objsCtn.removeChildren();
    this.backCtn.removeChildren();
    this.mapCtn.removeChildren();
    this.laserCtn.removeChildren();
    // Save & show game data
    let gameCtn = new PIXI.Container();
    // gameCtn.addChild(new PIXI.Sprite.fromImage('./assets/gameover.png'));
    let totalMoney = 0;
    let recordScore = 0;
    if (!(typeof Storage !== 'undefined')) {
      console.log('No LocalStorage Support');
    } else {
      if (localStorage.getItem('money') && localStorage.getItem('record')) {
        totalMoney = Number(localStorage.getItem('money')) + player.money;
        localStorage.setItem('money', totalMoney);
        recordScore = Math.max(
          Number(localStorage.getItem('record')),
          player.exitTimes
        );
        localStorage.setItem('record', recordScore);
      } else {
        totalMoney = player.money;
        recordScore = player.exitTimes;
        localStorage.setItem('money', player.money);
        localStorage.setItem('record', player.exitTimes);
      }
    }
    let text = new PIXI.Text(
      `This Game Money: ${player.money}\nThis Game Score: ${
        player.exitTimes
      }\nTotal Money: ${totalMoney}\nHighest Score: ${recordScore}`,
      { fontFamily: 'Orbitron-Medium, sans-serif' }
    );
    text.position.set(0, WH / 2);
    gameCtn.addChild(text);
    this.app.stage.addChild(gameCtn);

    this.setupPause();
    this.pause.on('click', () => {
      this.isPaused = false;
      this.worldCtn.visible = true;
      this.setupPlayer();
      this.setupLaser();
      this.setupPause();
      this.app.stage.removeChild(gameCtn);
    });
    this.shouldReset = false;
    this.worldCtn.visible = false;
  }
}

export default PixiMgr;
