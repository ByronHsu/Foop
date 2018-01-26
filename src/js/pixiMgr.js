import * as PIXI from 'pixi.js';

class PixiMgr {
  constructor() {
    let ww = window.innerWidth,
      wh = window.innerHeight;
    this.app = new PIXI.Application({
      width: ww,
      height: wh,
      antialias: true,
      backgroundColor: 0xb4b4b4,
    });
    document.querySelector('#game').appendChild(this.app.view);
    this.container = new PIXI.Container();
    (this.container.x = ww / 2), (this.container.y = wh / 2);
    this.app.stage.addChild(this.container);

    let tile = new PIXI.extras.TilingSprite(
      PIXI.Texture.fromImage('./assets/tile-glass.png'),
      500,
      500
    );
    // set sprite's origin on the center
    tile.anchor.set(0.5, 0.5);
    // set container in the center
    // tile.x = ww / 2, tile.y = wh / 2;
    this.container.addChild(tile);

    // 婉君
    let wan = new PIXI.Sprite.fromImage('../assets/wan.png');
    wan.anchor.set(0.5, 0.5);
    (wan.width = 100), (wan.height = 100);
    (wan.x = 0), (wan.y = 0);
    this.player = wan;
    this.container.addChild(wan);

    // Exit
    let exit = new PIXI.Sprite.fromImage('../assets/exit.png');
    exit.anchor.set(0.5, 0.5);
    (exit.width = 50), (exit.height = 50);
    (exit.x = 250), (exit.y = 250);
    this.container.addChild(exit);

    // Objs
    this.objs = []; // store obj reference
    this.objsContainer = new PIXI.Container();
    this.container.addChild(this.objsContainer);
  }
  updatePlayer(player) {
    this.player.x = player.x;
    this.player.y = player.y;
    // let player focus on center
    this.container.pivot.copy(this.player);
    document.querySelector('#hp').innerHTML = `hp: ${player.hp}`;
    document.querySelector('#speed').innerHTML = `speed: ${player.speed}`;
    document.querySelector('#money').innerHTML = `money: ${player.money}`;
  }
  updateObjs(objs) {
    // console.log(objs);
    // console.log(this.objs);

    // remove deleted obj from container
    // 1. iterate this.objsContainer
    // 2. 看傳進來的objs有無這個item
    // 3. 若沒有則表示他已不存在 => 刪除
    let length = this.objsContainer.children.length;
    for (let i = length - 1; i >= 0; i--) {
      let child = this.objsContainer.children[i];

      let x = objs.findIndex(obj => obj.id === child.id);

      if (x === -1) {
        //找不到
        this.objsContainer.removeChild(child);
        this.objs.splice(i, 1);
      }
    }
    // add new objs into container
    // 1. iterate objs
    // 2. 看this.objsContainer中有沒有這個obj
    // 3. 若沒有，則加進去
    for (let i = 0; i < objs.length; i++) {
      let x = this.objs.findIndex(obj => obj.id === objs[i].id);
      if (x !== -1) continue;
      let objType = objs[i].type;
      let obj = new PIXI.Sprite.fromImage(`../assets/${objType}.png`);
      obj.anchor.set(0.5, 0.5);
      (obj.width = objs[i].width), (obj.height = objs[i].height);
      (obj.x = objs[i].x), (obj.y = objs[i].y);
      obj.id = objs[i].id;
      obj.type = objs[i].type;
      this.objs.push(obj);
      this.objsContainer.addChild(obj);
    }
  }
}

export default PixiMgr;
