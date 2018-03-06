import { Container, Text } from 'pixi.js';
import 'pixi-sound';
import * as config from '../config';
import key from 'keymaster';

function showResumeScene() {
  this.isPaused = true;
  this.worldCtn.visible = true;
  this.worldCtn.alpha = 0.5;
  this.mapCtn.visible = false;
  this.pause.visible = false;
  let resumeCtn = new Container();
  let text = new Text('-- PRESS SPACE TO START --', config.fallbackFont);
  text.anchor.set(0.5, 0.5);
  text.x = config.ww / 2;
  text.y = config.wh / 2;
  resumeCtn.addChild(text);
  this.app.stage.addChild(resumeCtn);
  console.log('快完成了...一起加油');
  key('space', () => {
    this.isPaused = false;
    this.worldCtn.visible = true;
    this.worldCtn.alpha = 1;
    this.mapCtn.visible = true;
    this.pause.visible = true;
    this.app.stage.removeChild(resumeCtn);
    key.unbind('space');
  });
}
export { showResumeScene };
