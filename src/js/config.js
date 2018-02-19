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
const bgColor = 0xb4b4b4;

const imgUrl = [
  './assets/laser.png',
  './assets/pause.png',
  './assets/thorn.png',
  './assets/reddot.png',
  './assets/close-browser.png',
];

const jsonUrl = [
  './assets/images/login.json',
  './assets/images/resume.json',
  './assets/images/foop.json',
  './assets/images/mute.json',
  './assets/images/potion.json',
  './assets/images/shoe.json',
  './assets/images/trap.json',
  './assets/images/coin.json',
  './assets/images/worm.json',
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
  bugCount: [1, 1, 2, 3, 4],
  wallCount: [8, 8, 8, 8, 8],
  wallWidth: [50, 100, 150, 150, 200],
};
const ww = window.innerWidth;
const wh = window.innerHeight;

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
};
