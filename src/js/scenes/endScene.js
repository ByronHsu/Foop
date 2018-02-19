import { Container, Text } from 'pixi.js';
import * as config from '../config';
import { setupPlayer, setupLaser, setupPause, setupRestart } from '../setups';

function showEndScene(player) {
  this.shouldReset = false;
  this.worldCtn.visible = false;
  this.mapCtn.visible = false;
  this.playerCtn.removeChildren();
  this.objsCtn.removeChildren();
  this.backCtn.removeChildren();
  this.mapCtn.removeChildren();
  this.laserCtn.removeChildren();
  // Save & show this game data
  let endCtn = new Container();
  let totalMoney = 0;
  let recordScore = 0;
  if (!(typeof Storage !== 'undefined')) {
    console.log('No LocalStorage Support');
  } else {
    if (localStorage.getItem('money') && localStorage.getItem('record')) {
      totalMoney = Number(localStorage.getItem('money')) + player.money;
      localStorage.setItem('money', totalMoney);
      recordScore = Math.max(
        Number(localStorage.getItem('record')),
        player.exitTimes
      );
      localStorage.setItem('record', recordScore);
    } else {
      totalMoney = player.money;
      recordScore = player.exitTimes;
      localStorage.setItem('money', player.money);
      localStorage.setItem('record', player.exitTimes);
    }
  }
  // show Texts
  let text = new Text(
    `${localStorage.getItem('name')}\nThis Game Money: ${
      player.money
    }\nThis Game Score: ${
      player.exitTimes
    }\nTotal Money: ${totalMoney}\nHighest Score: ${recordScore}`,
    { fontFamily: 'Orbitron-Medium, sans-serif' }
  );
  text.position.set(0, config.app.h / 2);
  endCtn.addChild(text);
  // setup restartBtn
  setupRestart.call(this);
  endCtn.addChild(this.restart);
  this.restart.on('click', () => {
    this.isPaused = false;
    this.worldCtn.visible = true;
    this.mapCtn.visible = true;
    setupPlayer.call(this);
    setupLaser.call(this);
    setupPause.call(this);
    this.app.stage.removeChild(endCtn);
  });
  this.app.stage.addChild(endCtn);
}

export { showEndScene };
