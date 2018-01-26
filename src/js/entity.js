import uuid from 'uuid/v1';

class Box {
  constructor(args) {
    this.x = args.x;
    this.y = args.y;
    this.width = args.width;
    this.height = args.height;
    this.id = uuid();
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
    this.type = 'coin';
  }
  collide(player) {
    player.money += 1;
  }
}

class Shoe extends Box {
  constructor(args) {
    super(args);
    this.type = 'shoe';
  }
  collide(player) {
    player.speed += 1;
  }
}

class Trap extends Box {
  constructor(args) {
    super(args);
    this.type = 'trap';
  }
  collide(player) {
    player.speed -= 1;
  }
}

class Pill extends Box {
  constructor(args) {
    super(args);
    this.type = 'pill';
  }
  collide(player) {
    player.hp += 1;
  }
}

class Bug extends Box {
  constructor(args) {
    super(args);
    this.type = 'bug';
  }
  collide(player) {
    player.hp -= 1;
  }
}

export { Box, Coin, Shoe, Pill, Bug, Trap };
