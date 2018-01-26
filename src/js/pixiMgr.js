import * as PIXI from 'pixi.js';
import '../bin/pixi-display.js';

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

    // init ctn: world, player, objs, back
    this.worldCtn = new PIXI.Container();
    (this.worldCtn.x = ww / 2), (this.worldCtn.y = wh / 2);
    this.playerCtn = new PIXI.Container();
    this.objsCtn = new PIXI.Container();
    this.backCtn = new PIXI.Container();
    this.app.stage.addChild(this.worldCtn);
    this.worldCtn.addChild(this.playerCtn);
    this.worldCtn.addChild(this.objsCtn);
    this.worldCtn.addChild(this.backCtn);

    // init group: player, objs, back
    this.backGrp = new PIXI.display.Group(0, true);
    this.objsGrp = new PIXI.display.Group(1, true);
    this.playerGrp = new PIXI.display.Group(2, true);
    let arr = [this.backGrp, this.objsGrp, this.playerGrp];
    arr.forEach(g => {
      g.on('sort', sprite => {
        sprite.zOrder = -sprite.z;
      });
    });
    this.app.stage.addChild(new PIXI.display.Layer(this.backGrp));
    this.app.stage.addChild(new PIXI.display.Layer(this.objsGrp));
    this.app.stage.addChild(new PIXI.display.Layer(this.playerGrp));

    // init displayObjects reference
    this.playerRef = {};
    this.objsRef = [];
    this.loopRef = [];
    this.exitRef = [];

    let tile = new PIXI.extras.TilingSprite(
      PIXI.Texture.fromImage('./assets/tile-glass.png'),
      500,
      500
    );
    // set sprite's origin on the center
    tile.anchor.set(0.5, 0.5);
    tile.parentGroup = this.backGrp;
    // set container in the center
    // tile.x = ww / 2, tile.y = wh / 2;
    this.backCtn.addChild(tile);

    // Exit
    let exit = new PIXI.Sprite.fromImage('../assets/exit.png');
    exit.anchor.set(0.5, 0.5);
    (exit.width = 50), (exit.height = 50);
    (exit.x = 250), (exit.y = 250);
    exit.parentGroup = this.backGrp;
    this.backCtn.addChild(exit);

    // 婉君
    let wan = new PIXI.Sprite.fromImage('../assets/wan.png');
    wan.anchor.set(0.5, 0.5);
    (wan.width = 100), (wan.height = 100);
    (wan.x = 0), (wan.y = 0);
    wan.parentGroup = this.playerGrp;
    this.playerRef = wan;
    this.playerCtn.addChild(wan);
  }
  updatePlayer(player) {
    this.playerRef.x = player.x;
    this.playerRef.y = player.y;
    // let player focus on center
    this.worldCtn.pivot.copy(this.playerRef);

    document.querySelector('#hp').innerHTML = `hp: ${player.hp}`;
    document.querySelector('#speed').innerHTML = `speed: ${player.speed}`;
    document.querySelector('#money').innerHTML = `money: ${player.money}`;
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
      let sprite = this.createSprite(objs[i], 'objs');
      this.objsRef.push(sprite);
      this.objsCtn.addChild(sprite);
    }
  }
  createSprite(obj, group) {
    let sprite = new PIXI.Sprite.fromImage(`../assets/${obj.img}.png`);
    sprite.anchor.set(0.5, 0.5);
    switch (group) {
      case 'player':
        sprite.parentGroup = this.playerGrp;
        break;
      case 'back':
        sprite.parentGroup = this.backGrp;
        break;
      case 'objs':
        sprite.parentGroup = this.objsGrp;
        break;
      default:
    }
    Object.assign(sprite, obj);
    return sprite;
  }
}

export default PixiMgr;
