import { Container, Text } from 'pixi.js';
import axios from 'axios';
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
  // Save & show this game data & rank in endScene container
  let endCtn = new Container();
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

  //   // Save & Show World Rank:
  //   axios
  //     .post('/api/data', {
  //       name: JSON.parse(localStorage.getItem('user')).name,
  //       score: player.exitTimes,
  //     })
  //     .then(
  //       axios.get('/api/data').then(res => {
  //         let rankData = res.data;
  //         let text = new Text('World Rank', config.fontFamily);
  //         text.position.set(config.ww / 2, 0);
  //         endCtn.addChild(text);
  //         for (let i = 0; i < rankData.length; i++) {
  //           let text = new Text(
  //             `${i + 1}. ${rankData[i].name}: ${rankData[i].score}`,
  //             config.fontFamily
  //           );
  //           text.position.set(config.ww / 2, i * 50 + 50);
  //           endCtn.addChild(text);
  //         }
  //       })
  //     )
  //     .catch(err => console.error(err));

  //   // This game data & decorations
  //   text = new Text(`Game Score: ${player.exitTimes}`, config.fontFamily);
  //   text.position.set(100, config.wh - 100);
  //   endCtn.addChild(text);

  // setup restartBtn
  setupRestart.call(this);
  endCtn.addChild(this.restart);
  this.restart.on('click', () => {
    setupPlayer.call(this);
    setupLaser.call(this);
    setupPause.call(this);
    this.app.stage.removeChild(endCtn);
    this.onResumeScene();
  });
  this.app.stage.addChild(endCtn);
}

export { showEndScene };
