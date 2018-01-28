import * as PIXI from 'pixi.js';
import '../bin/pixi-display.js';
var idx = 0; // hack for tiling
class PixiMgr {
  constructor() {
    // init app
    let ww = window.innerWidth,
      wh = window.innerHeight;
    this.app = new PIXI.Application({
      width: ww,
      height: wh,
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
    (this.worldCtn.x = ww / 2), (this.worldCtn.y = wh / 2);
    this.playerCtn = new PIXI.Container();
    this.objsCtn = new PIXI.Container();
    this.backCtn = new PIXI.Container();
    this.laserCtn = new PIXI.Container();
    this.app.stage.addChild(this.worldCtn);
    this.worldCtn.addChild(this.playerCtn);
    this.worldCtn.addChild(this.objsCtn);
    this.worldCtn.addChild(this.backCtn);
    this.worldCtn.addChild(this.laserCtn);

    // init group: player, objs, back
    this.backGrp = new PIXI.display.Group(0, true);
    this.objsGrp = new PIXI.display.Group(1, true);
    this.playerGrp = new PIXI.display.Group(2, true);
    this.laserGrp = new PIXI.display.Group(3, true);
    let arr = [this.backGrp, this.objsGrp, this.playerGrp, this.laserGrp];
    arr.forEach(g => {
      g.on('sort', sprite => {
        sprite.zOrder = -sprite.z;
      });
    });
    this.app.stage.addChild(new PIXI.display.Layer(this.backGrp));
    this.app.stage.addChild(new PIXI.display.Layer(this.objsGrp));
    this.app.stage.addChild(new PIXI.display.Layer(this.playerGrp));
    this.app.stage.addChild(new PIXI.display.Layer(this.laserGrp));

    // init displayObjects reference
    this.playerRef = {};
    this.objsRef = [];
    this.loopRef = [];
    this.exitRef = [];
    this.laserRef = {};
    this.wan, this.laser;
  }
  init() {
    PIXI.loader
      .add(['../assets/laser.png'])
      .add('../assets/images/wan.json')
      .load(this.onAssetsLoaded.bind(this));
  }
  onAssetsLoaded() {
    this.setupPlayer();
    this.setupLaser();
  }
  setupPlayer() {
    let wans = [];
    for (let i = 0; i < 3; i++) {
      let wanTex = PIXI.Texture.fromFrame(`wan${i}.png`);
      wans.push(wanTex);
    }
    this.wan = new PIXI.extras.AnimatedSprite(wans);
    this.wan.anchor.set(0.5, 0.5);
    (this.wan.width = 100), (this.wan.height = 100);
    (this.wan.x = 0), (this.wan.y = 0);
    this.wan.parentGroup = this.playerGrp;
    this.playerRef = this.wan;
    this.playerCtn.addChild(this.wan);
  }
  setupLaser() {
    this.laser = new PIXI.Sprite(
      PIXI.loader.resources['../assets/laser.png'].texture
    );
    this.laser.anchor.set(0, 0.5);
    (this.laser.width = 50), (this.laser.height = 100);
    this.laser.position.set(-250, -230);
    this.laser.parentGroup = this.laserGrp;
    this.laserRef = this.laser;
    this.laserCtn.addChild(this.laser);
  }
  updatePlayer(player) {
    this.playerRef.x = player.x;
    this.playerRef.y = player.y;
    // let player focus on center
    this.worldCtn.pivot.copy(this.playerRef);
  }
  updateObjs(objs) {
    // console.log(objs);
    // console.log(this.objsRef);

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
        this.objsRef.splice(i, 1);
      }
    }
    // add new objs into container
    // 1. iterate objs
    // 2. 看this.objsCtn中有沒有這個obj
    // 3. 若沒有，則加進去
    for (let i = 0; i < objs.length; i++) {
      let x = this.objsRef.findIndex(obj => obj.id === objs[i].id);
      if (x !== -1) continue;
      let sprite = this.addSprite(objs[i]);
      this.objsRef.push(sprite);
    }
  }
  updateLaser(laser) {
    if (laser.width < 500) {
      this.laserRef.width = laser.width += 5;
      this.laserRef.y = laser.y = -230;
    } else if (laser.y < 250) {
      this.laserRef.y = laser.y += 3;
    }
  }
  addSprite(obj, tiling = false) {
    let sprite;
    let arr = ['tile-glass', 'tile-gold', 'tile-grass', 'tile-red'];
    if (tiling === true) {
      sprite = new PIXI.extras.TilingSprite.fromImage(
        `../assets/${arr[idx]}.png`
      );
      idx = idx + 1 > 3 ? 0 : idx + 1;
    } else sprite = new PIXI.Sprite.fromImage(`../assets/${obj.img}.png`);
    let grp, ctn;
    sprite.anchor.set(0.5, 0.5);
    switch (obj.group) {
      case 'player':
        grp = this.playerGrp;
        ctn = this.playerCtn;
        break;
      case 'back':
        grp = this.backGrp;
        ctn = this.backCtn;
        break;
      case 'objs':
        grp = this.objsGrp;
        ctn = this.objsCtn;
        break;
      default:
    }
    sprite.parentGroup = grp;
    Object.assign(sprite, obj);
    ctn.addChild(sprite);
    return sprite;
  }
  shine() {
    this.playerRef.play();
  }
  unShine() {
    this.playerRef.gotoAndStop(0);
  }
}

export default PixiMgr;
