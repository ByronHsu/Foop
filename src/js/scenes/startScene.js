import { Container, Texture, extras, Graphics, Sprite, utils } from 'pixi.js';
const { AnimatedSprite } = extras;
import 'pixi-sound';
import * as config from '../config';
var name;

window.fbAsyncInit = function() {
  FB.init({
    appId: '560212231013497',
    cookie: true, // enable cookies to allow the server to access
    // the session
    xfbml: true, // parse social plugins on this page
    version: 'v2.8', // use graph api version 2.8
  });
};

// Load the SDK asynchronously
(function(d, s, id) {
  var js,
    fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s);
  js.id = id;
  js.src = 'https://connect.facebook.net/en_US/sdk.js';
  fjs.parentNode.insertBefore(js, fjs);
})(document, 'script', 'facebook-jssdk');

function showStartScene() {
  this.isPaused = true;
  this.worldCtn.visible = false;
  this.mapCtn.visible = false;
  let startCtn = new Container();
  // startBtn
  let starts = [];
  for (let i = 0; i < 20; i++) {
    // update resume.png when start.png is done
    let startTex = Texture.fromFrame(`resume${i}.png`);
    starts.push(startTex);
  }
  let start = new AnimatedSprite(starts);
  start.anchor.set(0.5, 0.5);
  (start.width = 150), (start.height = 150);
  (start.x = config.ww / 3), (start.y = config.app.h / 2);
  startCtn.addChild(start);
  this.app.stage.addChild(startCtn);
  start.animationSpeed = 0.1;
  start.play();
  start.interactive = true;
  start.buttonMode = true;
  start.on('click', () => {
    if (!localStorage.getItem('name'))
      localStorage.setItem('name', document.querySelector('#username').value);
    document.querySelector('#username').setAttribute('style', 'display:none');
    startCtn.visible = false;
    this.isPaused = false;
    this.worldCtn.visible = true;
    this.mapCtn.visible = true;
  });
  // loginContainer
  let loginRect = new Container();
  loginRect.position.set(config.ww / 4, config.wh / 4);
  loginRect.width = config.ww / 2;
  loginRect.height = config.wh / 2;
  // loginRect background
  let graphics = new Graphics();
  graphics.lineStyle(2, config.lineColor[0], 1);
  graphics.beginFill(config.tileColor, 1);
  graphics.drawRect(0, 0, config.ww / 2, config.wh / 2);
  loginRect.addChild(graphics);
  // login Close btn
  let loginClose = new Sprite(utils.TextureCache['./assets/close-browser.png']);
  loginClose.scale.set(0.5, 0.5);
  loginClose.anchor.set(1, 0); // anchor at top right corner
  loginRect.addChild(loginClose);
  let pad = 20;
  loginClose.position.set(config.ww / 2 - pad, 0 + pad);
  loginClose.interactive = true;
  loginClose.buttonMode = true;
  loginClose.on('click', () => {
    startCtn.alpha = 1;
    this.app.stage.removeChild(loginRect);
  });
  // loginBtn
  let logins = [];
  for (let i = 0; i < 14; i++) {
    let loginTex = Texture.fromFrame(`login${i}.png`);
    logins.push(loginTex);
  }
  let login = new AnimatedSprite(logins);
  login.anchor.set(0.5, 0.5);
  (login.width = 200), (login.height = 100);
  (login.x = config.ww * 2 / 3), (login.y = config.app.h / 2);
  startCtn.addChild(login);
  this.app.stage.addChild(startCtn);
  login.animationSpeed = 0.1;
  login.play();
  login.interactive = true;
  login.buttonMode = true;
  login.on('click', () => {
    FB.getLoginStatus(response => {
      if (response.status !== 'connected') {
        FB.login(() => {
          FB.api('/me', response => {
            console.log('Successful login for: ' + response.name);
            localStorage.setItem('name', response.name);
            document
              .querySelector('#username')
              .setAttribute('placeholder', response.name);
            document.querySelector('#username').setAttribute('disabled', true);
          });
        });
      } else {
        alert(`${localStorage.getItem('name')} you have already logined!`);
      }
    });
  });
}
(function() {
  if (!localStorage.getItem('name')) return;
  document
    .querySelector('#username')
    .setAttribute('placeholder', localStorage.getItem('name'));
  document.querySelector('#username').setAttribute('disabled', true);
})();
function getName() {
  return name;
}
export { showStartScene, getName };
