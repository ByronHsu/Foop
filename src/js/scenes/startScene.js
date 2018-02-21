import { Container, Texture, extras, Text } from 'pixi.js';
const { AnimatedSprite } = extras;
import 'pixi-sound';
import * as config from '../config';
import key from 'keymaster';
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
// sdk callback
window.fbAsyncInit = function() {
  FB.init({ // eslint-disable-line
    appId: '560212231013497',
    cookie: true, // enable cookies to allow the server to access
    // the session
    xfbml: true, // parse social plugins on this page
    version: 'v2.8', // use graph api version 2.8
  });
};
function checkLogin() {
  return new Promise(resolve => {
    FB.getLoginStatus(response => resolve(response)); // eslint-disable-line
  });
}
function getFBName() {
  return new Promise(resolve => {
    FB.api('/me', response => { // eslint-disable-line
      resolve(response.name);
    });
  });
}
async function showStartScene() {
  this.isPaused = true;
  this.worldCtn.visible = true;
  this.worldCtn.alpha = 0.5;
  this.mapCtn.visible = false;
  let startCtn = new Container();
  let startText = new Text('-- PRESS ENTER TO START --');
  startText.anchor.set(0.5, 0.5);
  startText.x = config.ww / 2;
  startText.y = config.wh / 2;
  startCtn.addChild(startText);
  this.app.stage.addChild(startCtn);
  key('enter', async () => {
    let response = await checkLogin();
    if (response.status !== 'connected') {
      alert('Please Login First!');
      return;
    }
    startCtn.visible = false;
    this.isPaused = false;
    this.worldCtn.visible = true;
    this.worldCtn.alpha = 1;
    this.mapCtn.visible = true;
    this.app.stage.removeChild(startCtn);
    key.unbind('enter');
  });
  let response = await checkLogin();
  if (response.status === 'connected') {
    let fbName = await getFBName();
    let name = new Text(`Hello, ${fbName}`);
    name.anchor.set(0.5, 0.5);
    name.x = config.ww / 2;
    name.y = config.wh / 2 - 80;
    startCtn.addChild(name);
  } else {
    // loginBtn
    let logins = [];
    for (let i = 0; i < 14; i++) {
      let loginTex = Texture.fromFrame(`login${i}.png`);
      logins.push(loginTex);
    }
    let login = new AnimatedSprite(logins);
    (login.width = 200), (login.height = 100);
    login.anchor.set(0.5, 0.5);
    login.x = config.ww / 2;
    login.y = config.wh / 2 - 80;
    startCtn.addChild(login);
    this.app.stage.addChild(startCtn);
    login.animationSpeed = 0.1;
    login.play();
    login.interactive = true;
    login.buttonMode = true;
    login.on('click', () => {
      FB.login(async () => { // eslint-disable-line
        let fbName = await getFBName();
        let name = new Text(`Hello, ${fbName}`);
        name.anchor.set(0.5, 0.5);
        name.x = config.ww / 2;
        name.y = config.wh / 2 - 80;
        startCtn.addChild(name);
      });
      login.visible = false;
    });
  }
}
export { showStartScene };
