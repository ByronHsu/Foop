import { Container, Text } from 'pixi.js';
import * as config from '../config';
import { setupPlayer, setupLaser, setupPause } from '../setups';

function showEndScene(player, that) {
  that.worldCtn.visible = false;
  that.playerCtn.removeChildren();
  that.objsCtn.removeChildren();
  that.backCtn.removeChildren();
  that.mapCtn.removeChildren();
  that.laserCtn.removeChildren();
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
  let text = new Text(
    `This Game Money: ${player.money}\nThis Game Score: ${
      player.exitTimes
    }\nTotal Money: ${totalMoney}\nHighest Score: ${recordScore}`,
    { fontFamily: 'Orbitron-Medium, sans-serif' }
  );
  text.position.set(0, config.app.h / 2);
  endCtn.addChild(text);
  that.app.stage.addChild(endCtn);

  setupPause(that);
  that.pause.on('click', () => {
    that.isPaused = false;
    that.worldCtn.visible = true;
    setupPlayer(that);
    setupLaser(that);
    setupPause(that);
    that.app.stage.removeChild(endCtn);
  });
  that.shouldReset = false;
}

export { showEndScene };
