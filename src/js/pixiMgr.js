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

    // Coins
    this.coins = [];

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
  randomCoins(coins) {
    for (let i = 0; i < coins.length; i++) {
      let coin = new PIXI.Sprite.fromImage('../assets/coin.png');
      coin.anchor.set(0.5, 0.5);
      (coin.width = coins[i].width), (coin.height = coins[i].width);
      (coin.x = coins[i].x), (coin.y = coins[i].y);
      coin.id = coins[i].id;
      this.coins.push(coin);
      this.container.addChild(coin);
    }
  }
  destroyCoins(id) {
    for (let i = 0; i < this.coins.length; i++) {
      if (this.coins[i].id === id) {
        this.coins[i].destroy();
      }
    }
  }
}

export default PixiMgr;
