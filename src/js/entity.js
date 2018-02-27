import uuid from 'uuid/v1';
import * as config from './config';

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
    this.img = 'coin';
    this.group = 'objs';
    this.idx = args.idx;
  }
  hit(player) {
    player.score += 1;
  }
}

class Shoe extends Box {
  constructor(args) {
    super(args);
    this.type = 'shoe';
    this.img = 'shoe';
    this.group = 'objs';
    this.idx = args.idx;
  }
  hit(player) {
    player.speed += 1;
  }
}

class Trap extends Box {
  constructor(args) {
    super(args);
    this.type = 'trap';
    this.img = 'trap';
    this.group = 'objs';
    this.idx = args.idx;
  }
  hit(player) {
    player.speed -= 1;
    player.hp -= 1;
  }
}

class Potion extends Box {
  constructor(args) {
    super(args);
    this.type = 'potion';
    this.img = 'potion';
    this.group = 'objs';
    this.idx = args.idx;
  }
  hit(player) {
    player.hp += 1;
  }
}

class Bug extends Box {
  constructor(args) {
    super(args);
    this.type = 'bug';
    this.img = 'bug';
    this.group = 'objs';
    this.idx = args.idx;
  }
  hit(player) {
    player.score += (this.idx + 1) * 100;
  }
}

class Border extends Box {
  constructor(args) {
    let obj = {
      x: 0,
      y: 0,
      width: config.app.w,
    };
    super(Object.assign(args, obj));
    this.img = 'tile-gold';
    this.group = 'back';
    this.z = args.z;
  }
}

class Door extends Box {
  constructor(args) {
    let obj = {
      width: 50,
      height: 50,
    };
    super(Object.assign(args, obj));
    this.img = 'door';
    this.group = 'back';
    this.z = 1;
  }
}
class Wall extends Box {
  constructor(args) {
    super(args);
    this.img = 'wall';
    this.group = 'back';
    this.idx = args.idx;
    this.z = 1;
  }
}
export { Box, Coin, Shoe, Potion, Bug, Trap, Border, Door, Wall };
