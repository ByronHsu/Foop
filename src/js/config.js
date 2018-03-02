const lineColor = [
  0xffffff,
  0xeae087,
  0x64e96e,
  0x76e0f2,
  0xc9abff,
  0xfc447f,
  0xef9929,
];
const tileColor = 0x222222;
const bgColor = 0x000000;

const imgUrl = [
  './assets/laser.png',
  './assets/pause.png',
  './assets/reddot.png',
  './assets/map.png',
  './assets/keyboard.png',
  './assets/ok.png',
];

const jsonUrl = [
  './assets/images/login.json',
  './assets/images/resume.json',
  './assets/images/foop.json',
  './assets/images/mute.json',
  // './assets/images/potion.json',
  // './assets/images/shoe.json',
  // './assets/images/trap.json',
  // './assets/images/coin.json',
  './assets/images/bug.json',
];

const soundsUrl = [
  './assets/sounds/interface6.wav',
  './assets/sounds/beads.wav',
  './assets/sounds/coin3.wav',
  './assets/sounds/slime3.wav',
  './assets/sounds/hitFloor.wav',
];

const app = {
  w: 600,
  h: window.innerHeight,
};

const loopConfig = {
  bugCount: [1, 1, 2, 3, 4, 4, 4],
  wallCount: [8, 8, 8, 8, 8, 8, 8],
  wallWidth: [75, 100, 150, 150, 200, 200, 200],
  // super hard setting
  //   bugCount: [1, 1, 2, 3, 4],
  //   wallCount: [10, 10, 10, 10, 10],
  //   wallWidth: [200, 200, 200, 200, 200],
};
const ww = window.innerWidth;
const wh = window.innerHeight;

const fontFamily = {
  fontFamily: 'Orbitron-Medium, sans-serif, Arial',
  fill: '#ffffff',
};

const fallbackFont = {
  fill: '0xffffff',
};

const scoreFont = {
  fontFamily: 'Orbitron-Medium, sans-serif, Arial',
  fontSize: 50,
  align: 'center',
  fill: '#ffffff',
};

const playerStart = {
  x: -app.w / 2 + 100,
  y: -app.h / 2 + 100,
  width: 64,
  height: 38,
};

const laserStart = {
  x: -1 * app.w / 2,
  y: -1 * app.h / 2 + 10,
  width: 0,
  height: 100,
};

const hintModal = {
  rectWidth: 500,
  rectHeight: 300,
  pad: 20,
};

const pauseModal = {
  rectWidth: app.w,
  rectHeight: 150,
  btnWidth: 100,
  btnHeight: 100,
  btnAniSpeed: 0.3,
};

const restartHint = {
  rectWidth: app.w - 100,
  rectHeight: 60,
  rectPad: 80,
};

export {
  lineColor,
  tileColor,
  bgColor,
  soundsUrl,
  jsonUrl,
  imgUrl,
  app,
  loopConfig,
  ww,
  wh,
  fontFamily,
  playerStart,
  laserStart,
  fallbackFont,
  hintModal,
  pauseModal,
  restartHint,
  scoreFont,
};
