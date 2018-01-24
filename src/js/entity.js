class Box {
  constructor(args) {
    this.border = {
      xL: args.x - args.width / 2,
      xR: args.x + args.width / 2,
      yT: args.y - args.height / 2,
      yB: args.y + args.height / 2,
    };
    this.dots = [
      { x: this.border.xL, y: this.border.yT }, //左上
      { x: this.border.xR, y: this.border.yT }, //右上
      { x: this.border.xR, y: this.border.yB }, //右下
      { x: this.border.xL, y: this.border.yB }, //左下
    ];
  }
}

export { Box };
