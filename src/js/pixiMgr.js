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

    // Objs
    this.objs = [];

    // Exit
    let exit = new PIXI.Sprite.fromImage('../assets/exit.png');
    exit.anchor.set(0.5, 0.5);
    (exit.width = 50), (exit.height = 50);
    (exit.x = 250), (exit.y = 250);
    this.container.addChild(exit);
  }
  updatePlayer(player) {
    this.player.x = player.x;
    this.player.y = player.y;
    // let player focus on center
    this.container.pivot.copy(this.player);
  }
  generateObjs(objs) {
    for (let i = 0; i < objs.length; i++) {
      // Find object id pattern (Name-ID)
      let objName = objs[i].id.match(/\w+(?=-)/)[0];
      let obj = new PIXI.Sprite.fromImage(`../assets/${objName}.png`);
      obj.anchor.set(0.5, 0.5);
      (obj.width = objs[i].width), (obj.height = objs[i].width);
      (obj.x = objs[i].x), (obj.y = objs[i].y);
      obj.id = objs[i].id;
      this.objs.push(obj);
      this.container.addChild(obj);
    }
  }
  destroyObjs(id) {
    for (let i = 0; i < this.objs.length; i++) {
      if (this.objs[i].id === id) {
        this.objs[i].destroy();
      }
    }
  }
}

export default PixiMgr;
