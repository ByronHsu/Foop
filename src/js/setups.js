import {
  Texture,
  extras,
  utils,
  Sprite,
  loader,
  Graphics,
  Text,
} from 'pixi.js';
const { AnimatedSprite } = extras;
import * as config from './config';

const id = loader.resources;

function setupPlayer() {
  let foops = [];
  for (let i = 0; i < 3; i++) {
    let foopTex = Texture.fromFrame(`foop${i}.png`);
    foops.push(foopTex);
  }
  let foop = new AnimatedSprite(foops);
  foop.anchor.set(0.5, 0.5);
  (foop.width = 64), (foop.height = 38);
  (foop.x = config.playerStart.x), (foop.y = config.playerStart.y);
  foop.parentGroup = this.playerGrp;
  this.player = foop;
  //   this.player.filters = [new filters.GlowFilter(15, 2, 1, 0xffffff, 0.5)];
  this.playerCtn.addChild(this.player);
  foop.animationSpeed = 0.1;
  foop.play();

  this.playerMap = new Sprite(utils.TextureCache['./assets/reddot.png']);
  this.playerMap.anchor.set(0.5, 0.5);
  (this.playerMap.width = this.player.width / 5),
    (this.playerMap.height = this.player.height / 5);
  this.playerMap.z = 1;
  this.playerMap.parentGroup = this.mapGrp;
  this.mapCtn.addChild(this.playerMap);
}

function setupLaser() {
  this.laser = new Sprite(id['./assets/laser.png'].texture);
  this.laser.anchor.set(0, 0.5);
  (this.laser.width = 0), (this.laser.height = 100);
  this.laser.position.set(-1 * config.app.w / 2, -1 * config.app.h);
  this.laser.parentGroup = this.laserGrp;
  this.laserRef = this.laser;
  this.laserCtn.addChild(this.laser);
  this.blackPainter = new Graphics();
  this.blackPainter.parentGroup = this.mapGrp;
  this.blackPainter.x = -config.app.w / 2;
  //  this.blackPainter.y = -config.app.h / 2;
  this.playerCtn.addChild(this.blackPainter);
}

function setupPause() {
  // replace pause.png img when it's done
  this.pause = new Sprite(id['./assets/pause.png'].texture);
  this.pause.anchor.set(0.5);
  (this.pause.width = 40), (this.pause.height = 40);
  this.pause.position.set(100, 0);
  this.pause.interactive = true;
  this.pause.buttonMode = true;
  this.pause.on('click', () => this.onPauseScene());
  this.pause.parentGroup = this.mapGrp;
  this.pause.y = -config.app.h / 2 + 40;
  this.pause.x = config.app.w / 2 - 50;
  this.headerCtn.addChild(this.pause);
}

function setupRestart() {
  // replace resume.png with restart.png when it's done
  // restartBtn
  let restarts = [];
  for (let i = 0; i < 20; i++) {
    let restartTex = Texture.fromFrame(`resume${i}.png`);
    restarts.push(restartTex);
  }
  this.restart = new AnimatedSprite(restarts);
  this.restart.anchor.set(0.5, 0.5);
  (this.restart.width = 150), (this.restart.height = 150);
  (this.restart.x = config.ww / 3), (this.restart.y = config.app.h / 2);
  this.restart.animationSpeed = 0.3;
  this.restart.interactive = true;
  this.restart.buttonMode = true;
}

function setupSound() {
  const { soundsUrl } = config;
  for (let i = 0; i < soundsUrl.length; i++) {
    this.sounds.push(id[soundsUrl[i]]);
  }
}
function setupHeader() {
  const painter = new Graphics();
  painter.pivot.set(0.5, 0.5);
  const width = config.app.w,
    height = 75;
  painter.beginFill(0xffffff);
  painter.drawRect(-width / 2, -config.app.h / 2, width, height);
  // painter.drawRect(0, 0, width, height);
  painter.parentGroup = this.mapGrp;
  this.headerCtn.x = config.ww / 2;
  this.headerCtn.y = config.wh / 2;
  this.headerCtn.alpha = 0.5;
  this.score = new Text('Score: 0', config.fallbackFont);
  this.score.y = -config.app.h / 2 + 20;
  this.score.x = -config.app.w / 2 + 25;
  this.score.parentGroup = this.mapGrp;
  this.headerCtn.addChild(painter);
  this.headerCtn.addChild(this.score);
}
export {
  setupPlayer,
  setupLaser,
  setupPause,
  setupRestart,
  setupSound,
  setupHeader,
};
