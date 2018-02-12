import { Texture, extras, utils, Sprite, loader } from 'pixi.js';
import * as filters from 'pixi-filters';
import * as config from './config';

const id = loader.resources;

function setupPlayer(that) {
  let foops = [];
  for (let i = 0; i < 3; i++) {
    let foopTex = Texture.fromFrame(`foop${i}.png`);
    foops.push(foopTex);
  }
  let foop = new extras.AnimatedSprite(foops);
  foop.anchor.set(0.5, 0.5);
  (foop.width = 64), (foop.height = 38);
  (foop.x = 0), (foop.y = 0);
  foop.parentGroup = that.playerGrp;
  that.player = foop;
  console.log(filters);
  that.player.filters = [new filters.GlowFilter(15, 2, 1, 0xffffff, 0.5)];
  that.playerCtn.addChild(that.player);
  foop.animationSpeed = 0.1;
  foop.play();

  that.playerMap = new Sprite(utils.TextureCache['./assets/reddot.png']);
  that.playerMap.anchor.set(0.5, 0.5);
  (that.playerMap.width = that.player.width / 5),
    (that.playerMap.height = that.player.height / 5);
  that.playerMap.z = 1;
  that.playerMap.parentGroup = that.mapGrp;
  that.mapCtn.addChild(that.playerMap);
}

function setupLaser(that) {
  that.laser = new Sprite(id['./assets/laser.png'].texture);
  that.laser.anchor.set(0, 0.5);
  (that.laser.width = 0), (that.laser.height = 100);
  that.laser.position.set(-1 * config.app.w / 2, -1 * config.app.h);
  that.laser.parentGroup = that.laserGrp;
  that.laserRef = that.laser;
  that.laserCtn.addChild(that.laser);
}

function setupPause(that) {
  that.pause = new Sprite(id['./assets/pause.png'].texture);
  that.pause.anchor.set(0.5);
  (that.pause.width = 50), (that.pause.height = 50);
  that.pause.position.set(100, 0);
  that.pause.interactive = true;
  that.pause.buttonMode = true;
  that.pause.z = 2;
  that.pause.on('click', () => {
    that.isPaused = !that.isPaused;
    that.worldCtn.alpha = that.isPaused ? 0.5 : 1;
  });
  that.pause.parentGroup = that.mapGrp;
  that.mapCtn.addChild(that.pause);
}

function setupSound(that) {
  const { soundsUrl } = config;
  for (let i = 0; i < soundsUrl.length; i++) {
    that.sounds.push(id[soundsUrl[i]]);
  }
}

export { setupPlayer, setupLaser, setupPause, setupSound };
