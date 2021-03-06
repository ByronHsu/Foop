const fallspeed = 5;
const speed = 8;
const speedup = 0.5;
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
  './assets/logo.png',
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
  './assets/sounds/door.mp3',
  './assets/sounds/eatBug.mp3',
  './assets/sounds/gameover.mp3',
];

const app = {
  w: 600,
  h: window.innerHeight,
};
var wp = Math.floor(app.h / 100);
const loopConfig = {
  bugCount: [1, 1, 2, 3, 4, 4, 4, 4, 4, 4, 4, 4],
  wallCount: [wp, wp, wp, wp, wp, wp, wp, wp, wp, wp, wp, wp],
  wallWidth: [75, 100, 150, 150, 200, 200, 200, 200, 200, 200, 200, 200],
  // super hard setting
  // bugCount: [2, 2, 2, 3, 4],
  // wallCount: [8, 8, 8, 8, 8],
  // wallWidth: [200, 200, 200, 200, 200],
};
const ww = window.innerWidth;
const wh = window.innerHeight;

const fallbackFont = {
  fontFamily: 'Futura',
  letterSpacing: 1,
  fontWeight: '100',
  fill: '0xffffff',
};

const nameFont = {
  fontFamily: 'Futura',
  letterSpacing: 1,
  fontWeight: '100',
  fill: '0xffffff',
  fontSize: 35,
  wordWrap: true,
  wordWrapWidth: 200,
  breakWords: true,
};

const titleFont = {
  fontFamily: 'Futura',
  letterSpacing: 1,
  fontWeight: '100',
  fill: '0xffffff',
  fontSize: 35,
};

const scoreFont = {
  fontFamily: 'Futura',
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
  rectHeight: 250,
  pad: 40,
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
  fallspeed,
  speed,
  speedup,
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
  playerStart,
  laserStart,
  fallbackFont,
  hintModal,
  pauseModal,
  restartHint,
  scoreFont,
  titleFont,
  nameFont,
};
