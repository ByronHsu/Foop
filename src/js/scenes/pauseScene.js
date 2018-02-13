import { Graphics, Container, Texture, extras } from 'pixi.js';
const { AnimatedSprite } = extras;
import { sound } from 'pixi-sound';
import * as config from '../config';

function showPauseScene() {
  this.isPaused = true;
  this.worldCtn.alpha = 0.5;
  this.mapCtn.visible = false;
  let pauseRect = new Container();
  // pauseRect background
  let graphics = new Graphics();
  graphics.lineStyle(2, config.lineColor[this.now], 1);
  graphics.beginFill(config.tileColor, 1);
  let rectHeight = 200;
  graphics.drawRect(0, (config.wh - rectHeight) / 2, config.ww, rectHeight);
  pauseRect.addChild(graphics);
  // resumeBtn
  let resumes = [];
  for (let i = 0; i < 20; i++) {
    let resumeTex = Texture.fromFrame(`resume${i}.png`);
    resumes.push(resumeTex);
  }
  let resume = new AnimatedSprite(resumes);
  resume.anchor.set(0.5, 0.5);
  (resume.width = 150), (resume.height = 150);
  (resume.x = config.ww / 3), (resume.y = config.app.h / 2);
  resume.animationSpeed = 0.3;
  resume.interactive = true;
  resume.buttonMode = true;
  resume.on('click', () => {
    this.isPaused = false;
    this.worldCtn.alpha = 1;
    this.app.stage.removeChild(pauseRect);
    this.mapCtn.visible = true;
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
  mute.gotoAndStop(this.isMute ? 0 : 20);
  mute.anchor.set(0.5, 0.5);
  (mute.width = 150), (mute.height = 150);
  (mute.x = config.ww * 2 / 3), (mute.y = config.app.h / 2);
  mute.animationSpeed = 0.3;
  mute.interactive = true;
  mute.buttonMode = true;
  mute.on('click', () => {
    this.isMute = !this.isMute;
    sound.toggleMuteAll();
    mute.gotoAndStop(this.isMute ? 0 : 20);
  });
  mute.on('mouseover', () => {
    // let isMuteAni = [8, 7, 6, 5, 4, 3, 2, 1, 0];
    // mute.play();
    // console.log(Number(mute.texture.textureCacheIds[0].replace(/[^!0-9]/g, u => '')));
    // mute.onFrameChange = console.log('bro');
    // mute.fromFrames(isMuteAni);
  });
  mute.on('mouseout', () => {
    mute.gotoAndStop(this.isMute ? 0 : 20);
  });
  pauseRect.addChild(mute);
  pauseRect.parentGroup = this.laserGrp;
  this.app.stage.addChild(pauseRect);
}

export { showPauseScene };
