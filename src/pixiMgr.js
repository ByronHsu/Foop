import * as PIXI from 'pixi.js';
import './bin/pixi-display';
import * as filters from 'pixi-filters';
import * as config from './js/config';
import { setupPlayer, setupLaser, setupPause, setupSound } from './js/setups';
import { showEndScene } from './js/scenes/endScene';
import { showStartScene } from './js/scenes/startScene';
import { showPauseScene } from './js/scenes/pauseScene';
import { showResumeScene } from './js/scenes/resumeScene';

const id = PIXI.loader.resources;

class PixiMgr {
  constructor() {
    // init app
    this.app = new PIXI.Application({
      width: config.ww,
      height: config.wh,
      antialias: true,
      backgroundColor: config.bgColor,
    });
    document.querySelector('#game').appendChild(this.app.view);
    this.app.stage = new PIXI.display.Stage();
    this.app.stage.group.enableSort = true;
    this.app.renderer.view.style.position = 'absolute';
    this.app.renderer.view.style.display = 'block';
    this.app.renderer.autoResize = true;
    this.app.renderer.resize(config.ww, config.wh);

    // init ctn: world, player, objs, back, laser
    this.worldCtn = new PIXI.Container();
    (this.worldCtn.x = config.ww / 2), (this.worldCtn.y = config.wh / 2);
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
    (this.mapCtn.x = config.ww - 200), (this.mapCtn.y = config.wh / 2);
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
    this.laser, this.pause, this.restart;
    this.laserEnd = 0;
    this.isPaused = false;
    this.shouldReset = false;
    this.playerMap = {};
    this.now = 0;
    this.sounds = []; // store all sound objects
    this.isMute = false;
  }
  setup() {
    // Load resources
    return new Promise(resolve => {
      PIXI.loader
        .add(config.imgUrl)
        .add(config.jsonUrl)
        .add(config.soundsUrl)
        .load(() => {
          setupPlayer.call(this);
          setupLaser.call(this);
          setupPause.call(this);
          setupSound.call(this);
          resolve();
        });
    });
  }
  updatePlayer({ x, y }) {
    this.player.x = x;
    this.player.y = y;
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
  updateLaser(laser, fallspeed) {
    if (laser.width < config.app.w) {
      this.laserRef.width = laser.width += 20;
      this.laserRef.y = laser.y;
    } else this.laserRef.y = laser.y += fallspeed;
  }
  addWall(wall) {
    const idx = wall.idx % 7;
    let painter = new PIXI.Graphics();
    painter.beginFill(config.tileColor, 1);
    (painter.lineColor = config.lineColor[idx]), (painter.lineWidth = 2);
    painter.drawRect(0, 0, wall.width, wall.height);
    let sprite = new PIXI.Sprite(painter.generateCanvasTexture());
    sprite.anchor.set(0.5, 0.5);
    sprite.parentGroup = this.backGrp;
    sprite.filters = [
      new filters.GlowFilter(10, 2, 1, config.lineColor[idx], 1),
    ];
    this.backCtn.addChild(Object.assign(sprite, wall));
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
  onStartScene() {
    showStartScene.call(this);
  }
  onPauseScene() {
    showPauseScene.call(this);
  }
  onEndScene(player) {
    showEndScene.call(this, player);
  }
  onResumeScene() {
    showResumeScene.call(this);
  }
}

export default PixiMgr;
