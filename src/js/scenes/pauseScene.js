import { Graphics, Container, Texture, extras, loader, Sprite } from 'pixi.js';
const { AnimatedSprite } = extras;
import { sound } from 'pixi-sound';
import * as config from '../config';
const id = loader.resources;

function showPauseScene() {
  this.isPaused = true;
  this.worldCtn.alpha = 0.5;
  this.pause.visible = false;
  let pauseModal = new Container();
  // pauseModal background
  const {
    rectWidth,
    rectHeight,
    btnWidth,
    btnHeight,
    btnAniSpeed,
  } = config.pauseModal;
  let graphics = new Graphics();
  graphics.lineStyle(2, config.lineColor[this.now], 1);
  graphics.beginFill(0xffffff, 1);
  graphics.alpha = 0.5;
  graphics.drawRect(0, 0, rectWidth, rectHeight);
  // resumeBtn
  let resumes = [];
  for (let i = 0; i < 20; i++) {
    let resumeTex = Texture.fromFrame(`resume${i}.png`);
    resumes.push(resumeTex);
  }
  let resume = new AnimatedSprite(resumes);
  resume.anchor.set(0.5, 0.5);
  (resume.width = btnWidth), (resume.height = btnHeight);
  resume.position.set(rectWidth / 6, rectHeight / 2);
  resume.animationSpeed = btnAniSpeed;
  resume.interactive = true;
  resume.buttonMode = true;
  resume.on('click', () => {
    this.isPaused = false;
    this.worldCtn.alpha = 1;
    this.pause.visible = true;
    this.app.stage.removeChild(pauseModal);
  });
  resume.on('mouseover', () => resume.play());
  resume.on('mouseout', () => resume.stop());
  // toggle muteBtn
  let mutes = [];
  for (let i = 0; i < 21; i++) {
    let muteTex = Texture.fromFrame(`mute${i}.png`);
    mutes.push(muteTex);
  }
  let mute = new AnimatedSprite(mutes);
  mute.gotoAndStop(this.isMute ? 20 : 0);
  mute.anchor.set(0.5, 0.5);
  (mute.width = btnWidth), (mute.height = btnHeight);
  mute.position.set(rectWidth / 2, rectHeight / 2);
  mute.animationSpeed = btnAniSpeed;
  mute.interactive = true;
  mute.buttonMode = true;
  mute.on('click', () => {
    this.isMute = !this.isMute;
    sound.toggleMuteAll();
    mute.gotoAndStop(this.isMute ? 20 : 0);
  });
  mute.on('mouseover', () => (mute.alpha = 0.5));
  mute.on('mouseout', () => {
    mute.alpha = 1;
    mute.gotoAndStop(this.isMute ? 20 : 0);
  });
  // Toggle mapBtn
  let map = new Sprite(id['./assets/map.png'].texture);
  map.anchor.set(0.5, 0.5);
  (map.width = btnWidth), (map.height = btnHeight);
  map.position.set(rectWidth * 5 / 6, rectHeight / 2);
  map.interactive = true;
  map.buttonMode = true;
  map.on('click', () => {
    this.mapCtn.visible = !this.mapCtn.visible;
  });
  map.on('mouseover', () => (map.alpha = 0.5));
  map.on('mouseout', () => (map.alpha = 1));
  pauseModal.addChild(graphics, mute, resume, map);
  pauseModal.parentGroup = this.laserGrp;
  pauseModal.position.set(
    config.ww / 2 - rectWidth / 2,
    config.wh / 2 - rectHeight / 2
  );
  this.app.stage.addChild(pauseModal);
}

export { showPauseScene };
