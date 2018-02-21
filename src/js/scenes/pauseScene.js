import { Graphics, Container, Texture, extras, loader, Sprite } from 'pixi.js';
const { AnimatedSprite } = extras;
import { sound } from 'pixi-sound';
import * as config from '../config';
const id = loader.resources;

function showPauseScene() {
  this.isPaused = true;
  this.worldCtn.alpha = 0.5;
  let pauseRect = new Container();
  pauseRect.x = config.ww / 2;
  pauseRect.y = config.wh / 2;
  pauseRect.alpha = 0.5;
  // pauseRect background
  let graphics = new Graphics();
  graphics.lineStyle(2, config.lineColor[this.now], 1);
  graphics.beginFill(0xffffff, 1);
  let rectHeight = 150;
  graphics.drawRect(
    -config.app.w / 2,
    -rectHeight / 2,
    config.app.w,
    rectHeight
  );
  pauseRect.addChild(graphics);
  // resumeBtn
  let resumes = [];
  for (let i = 0; i < 20; i++) {
    let resumeTex = Texture.fromFrame(`resume${i}.png`);
    resumes.push(resumeTex);
  }
  let resume = new AnimatedSprite(resumes);
  resume.anchor.set(0.5, 0.5);
  (resume.width = 100), (resume.height = 100);
  resume.x = -config.app.w / 3;
  resume.animationSpeed = 0.3;
  resume.interactive = true;
  resume.buttonMode = true;
  resume.on('click', () => {
    this.isPaused = false;
    this.worldCtn.alpha = 1;
    this.app.stage.removeChild(pauseRect);
  });
  resume.on('mouseover', () => resume.play());
  resume.on('mouseout', () => resume.stop());
  pauseRect.addChild(resume);
  // toggle muteBtn
  let mutes = [];
  for (let i = 0; i < 21; i++) {
    let muteTex = Texture.fromFrame(`mute${i}.png`);
    mutes.push(muteTex);
  }
  let mute = new AnimatedSprite(mutes);
  mute.gotoAndStop(this.isMute ? 20 : 0);
  mute.anchor.set(0.5, 0.5);
  (mute.width = 100), (mute.height = 100);
  mute.x = 0;
  mute.animationSpeed = 0.3;
  mute.interactive = true;
  mute.buttonMode = true;
  mute.on('click', () => {
    this.isMute = !this.isMute;
    sound.toggleMuteAll();
    mute.gotoAndStop(this.isMute ? 20 : 0);
  });
  mute.on('mouseover', () => {
    mute.alpha = 0.5;
    // let isMuteAni = [8, 7, 6, 5, 4, 3, 2, 1, 0];
    // mute.play();
    // console.log(Number(mute.texture.textureCacheIds[0].replace(/[^!0-9]/g, u => '')));
    // mute.onFrameChange = console.log('bro');
    // mute.fromFrames(isMuteAni);
  });
  mute.on('mouseout', () => {
    mute.alpha = 1;
    mute.gotoAndStop(this.isMute ? 20 : 0);
  });
  pauseRect.addChild(mute);
  let map = new Sprite(id['./assets/map.png'].texture);
  map.anchor.set(0.5, 0.5);
  (map.width = 100), (map.height = 100);
  map.x = config.app.w / 3;
  map.interactive = true;
  map.buttonMode = true;
  map.on('click', () => {
    this.mapCtn.visible = !this.mapCtn.visible;
  });
  pauseRect.addChild(map);

  pauseRect.parentGroup = this.laserGrp;
  this.app.stage.addChild(pauseRect);
}

export { showPauseScene };
