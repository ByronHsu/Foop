import { Container, Text } from 'pixi.js';
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
  //   // Save Self Rank:
  //   let selfRank = [];
  //   if (!(typeof Storage !== 'undefined')) {
  //     console.log('No LocalStorage Support');
  //   } else {
  //     if (localStorage.getItem('selfRank')) {
  //       let parsedRank = JSON.parse(localStorage.getItem('selfRank'));
  //       parsedRank.push(player.exitTimes);
  //       parsedRank.sort((a, b) => b - a); // sort array in Descending
  //       if (parsedRank.length > 10) parsedRank.pop(); // remove if score not in 10th
  //       selfRank = parsedRank;
  //     } else selfRank.push(player.exitTimes); // if selfRank doesn't exist in localStorage
  //     localStorage.setItem('selfRank', JSON.stringify(selfRank));
  //   }
  //   // Show Self Rank:
  //   let text = new Text('Self Rank', config.fontFamily);
  //   text.position.set(0, 0);
  //   endCtn.addChild(text);
  //   for (let i = 0; i < 10; i++) {
  //     let score = selfRank[i] !== undefined ? selfRank[i] : '-';
  //     let text = new Text(`${i + 1}. ${score}`, config.fontFamily);
  //     text.position.set(0, i * 50 + 50);
  //     endCtn.addChild(text);
  //   }

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
      text.position.set(config.ww / 2, 0);
      endCtn.addChild(text);
      for (let i = 0; i < rankData.length; i++) {
        let text = new Text(
          `${i + 1}. ${rankData[i].name}: ${rankData[i].score}`,
          config.fontFamily
        );
        text.position.set(config.ww / 2, i * 50 + 50);
        endCtn.addChild(text);
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
        text = new Text(`Your Best: ${nowBest}`, config.fontFamily);
        text.position.set(config.ww / 2, config.wh - 100);
        endCtn.addChild(text);
      }
    })
    .catch(err => console.error(err));

  // This game data & decorations
  text = new Text(`Game Score: ${player.money}`, config.fontFamily);
  text.position.set(100, config.wh - 100);
  endCtn.addChild(text);

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
