class Box {
  constructor(args) {
    this.x = args.x;
    this.y = args.y;
    this.width = args.width;
    this.height = args.height;
    this.id = args.id;
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
  }
  collide(player) {
    player.money += 10;
  }
}

class Shoe extends Box {
  constructor(args) {
    super(args);
  }
  collide(player) {
    player.speed += 10;
  }
}

class Trap extends Box {
  constructor(args) {
    super(args);
  }
  collide(player) {
    player.speed -= 10;
  }
}

class Pill extends Box {
  constructor(args) {
    super(args);
  }
  collide(player) {
    player.hp += 10;
  }
}

class Bug extends Box {
  constructor(args) {
    super(args);
  }
  collide(player) {
    player.hp -= 10;
  }
}

export { Box, Coin, Shoe, Pill, Bug, Trap };
