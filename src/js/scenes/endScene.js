import { Container, Text, Graphics, Sprite, extras, Texture } from 'pixi.js';
const { AnimatedSprite } = extras;
import axios from 'axios';
import key from 'keymaster';
import * as config from '../config';
import { setupPlayer, setupLaser, setupPause, setupHeader } from '../setups';

function showEndScene(player) {
  this.shouldReset = false;
  this.worldCtn.visible = false;
  this.mapCtn.visible = false;
  this.playerCtn.removeChildren();
  this.objsCtn.removeChildren();
  this.backCtn.removeChildren();
  this.mapCtn.removeChildren();
  this.laserCtn.removeChildren();
  this.headerCtn.removeChildren();
  // Save & show this game data & rank in endScene container
  let endCtn = new Container();
  let text;
  // Border for data
  const idx = Math.abs(this.now) % 7;
  let painter = new Graphics();
  painter.beginFill(config.tileColor, 1);
  (painter.lineColor = config.lineColor[idx]), (painter.lineWidth = 10);
  let pad = 10;
  painter.drawRect(0, 0, config.app.w - pad, config.app.h - pad);
  let sprite = new Sprite(painter.generateCanvasTexture());
  sprite.anchor.set(0.5, 0.5);
  sprite.position.set(config.ww / 2, config.wh / 2);
  sprite.parentGroup = this.backGrp;
  endCtn.addChild(sprite);

  // Save & Show World Rank:
  let postData = {
    name: localStorage.getItem('username'),
    id: localStorage.getItem('userid'),
    score: player.money,
  };
  axios
    .post('/api/bestten', postData)
    .then(records => {
      let rankData = records.data;
      let text = new Text('World Rank', config.fontFamily);
      text.position.set(config.ww / 2 - 200, config.wh / 2 - 100);
      endCtn.addChild(text);
      for (let i = 0; i < rankData.length; i++) {
        let text = new Text(`${i + 1}.`, config.fontFamily);
        text.position.set(config.ww / 2 - 200, config.wh / 2 - 50 + i * 30);
        let text2 = new Text(rankData[i].name, config.fontFamily);
        text2.position.set(config.ww / 2 - 140, config.wh / 2 - 50 + i * 30);
        let text3 = new Text(rankData[i].score, config.fontFamily);
        text3.position.set(config.ww / 2 + 50, config.wh / 2 - 50 + i * 30);
        endCtn.addChild(text, text2, text3);
      }
    })
    .then(axios.post('/api/data', postData).catch(err => console.error(err)))
    .catch(err => console.error(err));

  // Show Self High Score
  axios
    .post('/api/getbest', {
      id: localStorage.getItem('userid'),
    })
    .then(bestRecord => {
      if (bestRecord) {
        let nowBest = Math.max(bestRecord.data[0].score, player.money);
        text = new Text(`YOUR BEST`, config.fontFamily);
        text.position.set(config.ww / 2 - 200, 100);
        endCtn.addChild(text);
        text = new Text(nowBest, config.fontFamily);
        text.position.set(config.ww / 2 - 200, 150);
        endCtn.addChild(text);
      }
    })
    .catch(err => console.error(err));

  // This game data & decorations
  text = new Text(
    `NAME: ${localStorage.getItem('username')}`,
    config.fontFamily
  );
  text.position.set(config.ww / 2 - 200, 50);
  endCtn.addChild(text);
  text = new Text(`YOUR SCORE`, config.fontFamily);
  text.position.set(config.ww / 2, 50);
  endCtn.addChild(text);
  text = new Text(player.money, config.fontFamily);
  text.position.set(config.ww / 2, 100);
  endCtn.addChild(text);
  // Foop Animation
  let foops = [];
  for (let i = 0; i < 16; i++) {
    let foopTex = Texture.fromFrame(`foop${i}.png`);
    foops.push(foopTex);
  }
  let foop = new AnimatedSprite(foops);
  foop.position.set(config.ww / 2, config.wh / 2 - 100);
  foop.scale.set(2);
  foop.animationSpeed = 0.1;
  foop.play();
  // Restart Hint
  let painter2 = new Graphics();
  painter2.beginFill(config.tileColor, 1);
  (painter2.lineColor = config.lineColor[0]), (painter2.lineWidth = 5);
  painter2.drawRect(0, 0, config.app.w - 100, 60);
  sprite = new Sprite(painter2.generateCanvasTexture());
  sprite.anchor.set(0.5, 0.5);
  sprite.position.set(config.ww / 2, config.wh - 80);
  text = new Text(`press 'space' to START AGAIN`, config.fontFamily);
  text.anchor.set(0.5, 0.5);
  sprite.addChild(text);
  endCtn.addChild(sprite, foop);
  let fadeOut = true;
  this.app.ticker.add(() => {
    sprite.alpha += (fadeOut === true ? -1 : 1) * 0.01;
    foop.x += (fadeOut === true ? 1 : -1) * 0.01 * 200;
    if (sprite.alpha <= 0) fadeOut = false;
    else if (sprite.alpha >= 1) fadeOut = true;
  });

  // Restart key control
  key('space', () => {
    setupPlayer.call(this);
    setupLaser.call(this);
    setupHeader.call(this);
    setupPause.call(this);
    this.app.stage.removeChild(endCtn);
    this.isPaused = false;
    this.worldCtn.visible = true;
    this.worldCtn.alpha = 1;
    this.mapCtn.visible = true;
    this.pause.visible = true;
    key.unbind('space');
  });
  this.app.stage.addChild(endCtn);
}

export { showEndScene };
