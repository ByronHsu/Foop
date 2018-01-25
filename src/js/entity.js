class Box {
  constructor(args) {
    this.x = args.x;
    this.y = args.y;
    this.width = args.width;
    this.height = args.height;
  }
  get edge() {
    return {
      xL: this.x - this.width / 2,
      xR: this.x + this.width / 2,
      yT: this.y - this.height / 2,
      yB: this.y + this.height / 2,
    };
  }
  get vtx() {
    let e = this.edge;
    return [
      { x: e.xL, y: e.yT }, //左上
      { x: e.xR, y: e.yT }, //右上
      { x: e.xR, y: e.yB }, //右下
      { x: e.xL, y: e.yB }, //左下
    ];
  }
}

class Coin extends Box {
  constructor(args) {
    super(args);
    this.id = args.id;
  }
  hit(player) {
    player.money += 10;
    console.log('coin id: ', this.id);
    console.log('player.money', player.money);
  }
}

export { Box, Coin };
