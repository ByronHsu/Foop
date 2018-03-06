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
  let username = localStorage.getItem('username');
  let userid = localStorage.getItem('userid');
  // Border for data
  const idx = Math.abs(this.now) % 7;
  let painter = new Graphics();
  painter.beginFill(config.tileColor, 1);
  (painter.lineColor = config.lineColor[idx]), (painter.lineWidth = 10);
  let pad = 10;
  painter.drawRect(0, 0, config.app.w - pad, config.app.h - pad);
  let rankModal = new Sprite(painter.generateCanvasTexture());
  rankModal.position.set(0, 0);
  rankModal.parentGroup = this.backGrp;

  // Save & Show World Rank:
  function showRank(records) {
    let rankData = records.data;
    let rankCont = new Container();
    let text = new Text('World Rank', config.fallbackFont);
    text.position.set(0, -50);
    rankCont.addChild(text);
    for (let i = 0; i < rankData.length; i++) {
      let rank = new Text(`${i + 1}.`, config.fallbackFont);
      rank.position.set(0, i * 30);
      let name = new Text(rankData[i].name, config.fallbackFont);
      name.position.set(config.app.w / 8, i * 30);
      let score = new Text(rankData[i].score, config.fallbackFont);
      score.position.set(config.app.w / 2, i * 30);
      rankCont.addChild(rank, name, score);
    }
    rankCont.position.set(config.app.w / 8, config.app.h / 2 - 50);
    endCtn.addChild(rankCont);
  }
  let postData = {
    name: username,
    id: userid,
    score: player.score,
  };
  // don't save the record if user haven't login
  if (username !== 'Anonymous' && userid) {
    axios
      .post('/api/bestten', postData)
      .then(records => showRank(records))
      .then(axios.post('/api/data', postData).catch(err => console.error(err)))
      .catch(err => console.error(err));
  } else {
    axios
      .get('/api/bestten')
      .then(records => showRank(records))
      .catch(err => console.error(err));
  }

  // Show Self High Score if logged in
  if (username !== 'Anonymous' && userid)
    axios
      .post('/api/getbest', {
        id: userid,
      })
      .then(bestRecord => {
        if (bestRecord) {
          let nowBest = Math.max(bestRecord.data[0].score, player.score);
          let bestTitle = new Text(`YOUR BEST`, config.fallbackFont);
          bestTitle.anchor.set(0.5, 0);
          bestTitle.position.set(config.app.w / 4, 100);
          let best = new Text(nowBest, config.fallbackFont);
          best.anchor.set(0.5, 0);
          best.position.set(config.app.w / 4, 150);
          endCtn.addChild(bestTitle, best);
        }
      })
      .catch(err => console.error(err));
  else {
    let logins = [];
    for (let i = 0; i < 14; i++) {
      let loginTex = Texture.fromFrame(`login${i}.png`);
      logins.push(loginTex);
    }
    let login = new AnimatedSprite(logins);
    login.anchor.set(0.5, 0);
    (login.width = 200), (login.height = 100);
    login.position.set(config.app.w / 4, 100);
    endCtn.addChild(login);
    login.animationSpeed = 0.1;
    login.play();
    login.interactive = true;
    login.buttonMode = true;
    login.on('click', () => {
      FB.login(response => { // eslint-disable-line
        if (response.status === 'connected') {
          FB.api('/me', res => { // eslint-disable-line
            localStorage.setItem('username', res.name);
            localStorage.setItem('userid', res.id);
          });
          endCtn.removeChild(login);
          //  this.onResumeScene();
        } else {
          console.log('login fail');
        }
      });
    });
  }

  // This game data & decorations
  let name = new Text(username, config.fallbackFont);
  name.anchor.set(0.5, 0);
  name.position.set(config.app.w / 4, 50);
  let scoreTitle = new Text(`YOUR SCORE`, config.fallbackFont);
  scoreTitle.anchor.set(0.5, 0);
  scoreTitle.position.set(config.app.w * 3 / 4, 50);
  let score = new Text(player.score, config.scoreFont);
  score.anchor.set(0.5, 0);
  score.position.set(config.app.w * 3 / 4, 100);
  // Foop Animation
  let foops = [];
  for (let i = 0; i < 16; i++) {
    let foopTex = Texture.fromFrame(`foop${i}.png`);
    foops.push(foopTex);
  }
  let foop = new AnimatedSprite(foops);
  foop.position.set(config.app.w / 2, config.wh / 2 - 100);
  foop.scale.set(2);
  foop.animationSpeed = 0.1;
  foop.play();
  // Restart Hint
  const { rectWidth, rectHeight, rectPad } = config.restartHint;
  let painter2 = new Graphics();
  painter2.beginFill(config.tileColor, 1);
  (painter2.lineColor = config.lineColor[0]), (painter2.lineWidth = 5);
  painter2.drawRect(0, 0, rectWidth, rectHeight);
  let hintBox = new Sprite(painter2.generateCanvasTexture());
  hintBox.anchor.set(0.5, 0.5);
  hintBox.position.set(config.app.w / 2, config.wh - rectPad);
  let hintText = new Text(`Press 'SPACE' to START AGAIN`, config.fallbackFont);
  hintText.anchor.set(0.5, 0.5);
  hintBox.addChild(hintText);
  let fadeOut = true;
  this.app.ticker.add(() => {
    hintBox.alpha += (fadeOut === true ? -1 : 1) * 0.01;
    foop.x += (fadeOut === true ? 1 : -1) * 0.01 * 200;
    if (hintBox.alpha <= 0) fadeOut = false;
    else if (hintBox.alpha >= 1) fadeOut = true;
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
  endCtn.addChild(name, scoreTitle, score, rankModal, hintBox, foop);
  endCtn.position.set(config.ww / 2 - config.app.w / 2, 0);
  this.app.stage.addChild(endCtn);
}

export { showEndScene };
