import * as PIXI from 'pixi.js';
import '../bin/pixi-display.js';

// init app
var ww = window.innerWidth,
  wh = window.innerHeight;

var app = new PIXI.Application({
  width: ww,
  height: wh,
  antialias: true,
  backgroundColor: 0xb4b4b4,
});

document.querySelector('#game').appendChild(app.view);
app.stage = new PIXI.display.Stage();
app.stage.group.enableSort = true;

app.renderer.view.style.position = 'absolute';
app.renderer.view.style.display = 'block';
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

// init ctn: world, player, objs, back
var worldCtn = new PIXI.Container();
(worldCtn.x = ww / 2), (worldCtn.y = wh / 2);
var playerCtn = new PIXI.Container();
var objsCtn = new PIXI.Container();
var backCtn = new PIXI.Container();
app.stage.addChild(worldCtn);
worldCtn.addChild(playerCtn);
worldCtn.addChild(objsCtn);
worldCtn.addChild(backCtn);

// init group: player, objs, back
var backGrp = new PIXI.display.Group(0, true);
var objsGrp = new PIXI.display.Group(1, true);
var playerGrp = new PIXI.display.Group(2, true);
var arr = [backGrp, objsGrp, playerGrp];
arr.forEach(g => {
  g.on('sort', sprite => {
    sprite.zOrder = -sprite.z;
  });
});
app.stage.addChild(new PIXI.display.Layer(backGrp));
app.stage.addChild(new PIXI.display.Layer(objsGrp));
app.stage.addChild(new PIXI.display.Layer(playerGrp));

// init displayObjects reference
var playerRef = {};
var objsRef = [];
// var loopRef = [];
// var exitRef = [];

function init() {
  // default
  var tile = new PIXI.extras.TilingSprite(
    PIXI.Texture.fromImage('./assets/tile-glass.png'),
    500,
    500
  );
  // set sprite's origin on the center
  tile.anchor.set(0.5, 0.5);
  tile.parentGroup = backGrp;
  // set container in the center
  // tile.x = ww / 2, tile.y = wh / 2;
  backCtn.addChild(tile);

  // Exit
  let exit, wan;
  PIXI.loader
    .add('../assets/exit.png')
    .add('../assets/wan.png')
    .load(onAssetsLoaded);
  function onAssetsLoaded() {
    setupExit();
    setupPlayer();
  }
  function setupExit() {
    exit = new PIXI.Sprite(PIXI.loader.resources['../assets/exit.png'].texture);
    exit.anchor.set(0.5, 0.5);
    (exit.width = 50), (exit.height = 50);
    (exit.x = 250), (exit.y = 250);
    exit.parentGroup = backGrp;
    backCtn.addChild(exit);
  }

  // 婉君
  function setupPlayer() {
    wan = new PIXI.Sprite(PIXI.loader.resources['../assets/wan.png'].texture);
    wan.anchor.set(0.5, 0.5);
    (wan.width = 100), (wan.height = 100);
    (wan.x = 0), (wan.y = 0);
    wan.parentGroup = playerGrp;
    playerRef = wan;
    playerCtn.addChild(wan);
  }
}

function updatePlayer(player) {
  playerRef.x = player.x;
  playerRef.y = player.y;
  // let player focus on center
  worldCtn.pivot.copy(playerRef);

  // document.querySelector('#hp').innerHTML = `hp: ${player.hp}`;
  // document.querySelector('#speed').innerHTML = `speed: ${player.speed}`;
  // document.querySelector('#money').innerHTML = `money: ${player.money}`;
}

function updateObjs(objs) {
  // console.log(objs);
  // console.log(objsRef);

  // remove deleted obj from container
  // 1. iterate objsCtn
  // 2. 看傳進來的objs有無這個item
  // 3. 若沒有則表示他已不存在 => 刪除
  let length = objsCtn.children.length;
  for (let i = length - 1; i >= 0; i--) {
    let child = objsCtn.children[i];
    let x = objs.findIndex(obj => obj.id === child.id);
    if (x === -1) {
      //找不到
      objsCtn.removeChild(child);
      objsRef.splice(i, 1);
    }
  }
  // add new objs into container
  // 1. iterate objs
  // 2. 看this.objsCtn中有沒有這個obj
  // 3. 若沒有，則加進去
  for (let i = 0; i < objs.length; i++) {
    let x = objsRef.findIndex(obj => obj.id === objs[i].id);
    if (x !== -1) continue;
    let sprite = createSprite(objs[i], 'objs');
    objsRef.push(sprite);
    objsCtn.addChild(sprite);
  }
}

function createSprite(obj, group) {
  let sprite = new PIXI.Sprite.fromImage(`../assets/${obj.img}.png`);
  sprite.anchor.set(0.5, 0.5);
  switch (group) {
    case 'player':
      sprite.parentGroup = playerGrp;
      break;
    case 'back':
      sprite.parentGroup = backGrp;
      break;
    case 'objs':
      sprite.parentGroup = objsGrp;
      break;
    default:
  }
  Object.assign(sprite, obj);
  return sprite;
}

export { init, updatePlayer, updateObjs, createSprite };
