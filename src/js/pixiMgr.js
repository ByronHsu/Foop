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

    let panda = new PIXI.Sprite.fromImage('../assets/panda.png');
    panda.anchor.set(0.5, 0.5);
    (panda.width = 100), (panda.height = 100);
    (panda.x = 0), (panda.y = 0);
    this.player = panda;
    this.container.addChild(panda);

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
}

export default PixiMgr;
