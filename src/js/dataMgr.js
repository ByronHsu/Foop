// import key from 'keymaster';
// import { Box, Coin, Shoe, Trap, Pill, Bug, Border, Door } from './entity.js';
// import { outside, hit } from './physic.js';
// import { rnGen, rnGenInt } from './utils.js';
// import dat from 'dat.gui';

// const gui = new dat.GUI();

// const SPEED = 5;
// const playerBox = {
//   x: 0,
//   y: 0,
//   width: 100,
//   height: 100,
// };
// const exitBox = {
//   x: 250,
//   y: 250,
//   width: 50,
//   height: 50,
// };
// const loopBox = {
//   x: 0,
//   y: 0,
//   width: 500,
//   height: 500,
// };

// class Looper {
//   constructor(f) {
//     this.arr = [];
//     this.now = 0;
//     this.stack = [2];
//     console.log(f);
//     this.cb = f;
//   }
//   hitExitUp() {
//     this.now = this.now - 1 < 0 ? 0 : this.now - 1;
//     // 決定裡面那圈要走幾輪
//     if (this.now !== 0) this.stack.pushFront(2);
//     return this.arr[this.now].startUpBox;
//   }
//   hitExitDown() {
//     this.stack[0]--;
//     if (this.stack[0] === 0) {
//       this.stack.splice(0, 1);
//     }
//     if (this.stack.length === 0) {
//       // 開新世界
//       this.now = this.now + 1;
//       this.createLoop((this.now * 2 + 1) * 500);
//       this.stack.pushFront(2);
//       return this.arr[this.now].startDownBox;
//     } else {
//       // 回到這層的頭
//       // 繼續走它裡面QAQ, 0就沒有裡面可以走了
//       return this.arr[this.now].startDownBox;
//     }
//   }
//   createLoop(height) {
//     let pad = 25;
//     let obj = { border: new Border({ height }) };
//     let prevLoop = this.arr[this.now];

//     obj.startUpBox = new Door({
//       x: obj.border.vtx[0].x + pad,
//       y: obj.border.vtx[0].y + pad,
//     });
//     if (prevLoop !== undefined) {
//       obj.startDownBox = new Door({
//         x: prevLoop.border.vtx[1].x - pad,
//         y: prevLoop.border.vtx[1].y - pad,
//       });
//       obj.exitUpBox = new Door({
//         x: prevLoop.border.vtx[4].x + pad,
//         y: prevLoop.border.vtx[4].y + pad,
//       });
//     }
//     obj.exitDownBox = new Door({
//       x: obj.border.vtx[3].y - pad,
//       y: obj.border.vtx[3].y - pad,
//     });
//     let arr = [
//       obj.startUpBox,
//       obj.startDownBox,
//       obj.exitUpBox,
//       obj.exitDownBox,
//     ];
//     arr.forEach(val => {
//       if (val !== undefined) this.cb(val);
//     });
//     this.cb(obj.border, true); // tiling
//     this.arr.push(obj);
//   }
//   get prevLoop() {
//     return this.arr[this.now - 1];
//   }
//   get loop() {
//     return this.arr[this.now];
//   }
// }

// class DataMgr {
//   constructor(f) {
//     this.player = new Box(playerBox);
//     this.player.hp = 100;
//     this.player.speed = SPEED;
//     this.player.money = 0;
//     gui.add(this.player, 'hp', 0, 200).listen();
//     gui.add(this.player, 'speed', 0, 50).listen();
//     gui.add(this.player, 'money', 0, 200).listen();
//     this.objs = [];
//     this.looper = new Looper(f);
//     this.looper.createLoop(500);
//   }
//   playerMove() {
//     let arr = [
//       { key: 'w', x: 0, y: -1 },
//       { key: 's', x: 0, y: 1 },
//       { key: 'a', x: -1, y: 0 },
//       { key: 'd', x: 1, y: 0 },
//     ];
//     arr.forEach(obj => {
//       if (key.isPressed(obj.key)) {
//         let tmp = new Box(this.player);
//         tmp.x += this.player.speed * obj.x;
//         tmp.y += this.player.speed * obj.y;
//         if (
//           !outside(tmp, this.looper.loop.border) &&
//           ((this.looper.prevLoop !== undefined &&
//             outside(tmp, this.looper.prevLoop.border)) ||
//             this.looper.prevLoop === undefined)
//         ) {
//           this.player.x += this.player.speed * obj.x;
//           this.player.y += this.player.speed * obj.y;
//         }
//       }
//     });
//   }
//   hitExit() {
//     if (hit(this.player, this.looper.loop.exitDownBox)) {
//       let ret = this.looper.hitExitDown();
//       (this.player.x = ret.x), (this.player.y = ret.y);
//     }
//     if (hit(this.player, this.looper.loop.exitUpBox)) {
//       let ret = this.looper.hitExitUp();
//       (this.player.x = ret.x), (this.player.y = ret.y);
//     }
//   }
//   hitObjs() {
//     // 要從後面刪回來，不然如果直接刪掉，i++，會跳過一個obj
//     for (let i = this.objs.length - 1; i >= 0; i--) {
//       if (hit(this.player, this.objs[i])) {
//         this.objs[i].hit(this.player);
//         this.objs.splice(i, 1);
//       }
//     }
//   }
//   randomGenObjs() {
//     // 持續保持5個在場面上
//     while (this.objs.length < 5) {
//       let args = {
//         x: rnGen(-loopBox.width / 2, loopBox.width / 2),
//         y: rnGen(-loopBox.height / 2, loopBox.height / 2),
//         width: 50,
//         height: 50,
//       };
//       let arr = [
//         new Coin(args),
//         new Shoe(args),
//         new Trap(args),
//         new Pill(args),
//         new Bug(args),
//       ];
//       this.objs.push(arr[rnGenInt(0, 4)]);
//     }
//   }
// }

// export default DataMgr;
