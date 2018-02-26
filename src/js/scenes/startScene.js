import { Container, Text, Graphics, utils, Sprite } from 'pixi.js';
import 'pixi-sound';
import * as config from '../config';

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

function showStartScene() {
  this.isPaused = true;
  this.worldCtn.visible = true;
  this.worldCtn.alpha = 0.5;
  this.mapCtn.visible = false;
  this.pause.visible = false;
  let startCtn = new Container();

  let text1 = new Text('Anonymous', config.fallbackFont);
  text1.anchor.set(0.5, 0.5);
  text1.x = config.ww / 2;
  text1.y = config.wh / 2 - 50;
  text1.interactive = true;
  text1.buttonMode = true;
  text1.visible = false;

  let text2 = new Text('Facebook Login', config.fallbackFont);
  text2.anchor.set(0.5, 0.5);
  text2.x = config.ww / 2;
  text2.y = config.wh / 2;
  text2.interactive = true;
  text2.buttonMode = true;
  text2.visible = false;
  let buttons = [
    {
      text: text1,
      press: () => {
        this.app.stage.removeChild(startCtn);
        localStorage.setItem('username', 'Anonymous');
        localStorage.setItem('userid', '');
        this.onResumeScene();
      },
    },
    {
      text: text2,
      press: () => {
        FB.login(response => { // eslint-disable-line
          if (response.status === 'connected') {
            FB.api('/me', res => { // eslint-disable-line
              localStorage.setItem('username', res.name);
              localStorage.setItem('userid', res.id);
            });
            this.app.stage.removeChild(startCtn);
            this.onResumeScene();
          } else {
            console.log('login fail');
          }
        });
      },
    },
  ];
  buttons.forEach(btn => {
    startCtn.addChild(btn.text);
    btn.text.on('mouseover', () => {
      btn.text.style.fill = 0x5994f2;
    });
    btn.text.on('mouseout', () => {
      btn.text.style.fill = 0xffffff;
    });
    btn.text.on('click', btn.press);
  });
  // Hint
  if (!localStorage.getItem('hint')) {
    let graphics = new Graphics();
    graphics.lineStyle(5, config.lineColor[0], 1);
    graphics.beginFill(config.bgColor, 1);
    let rectHeight = 300,
      rectWidth = 500,
      pad = 20;
    graphics.drawRect(
      config.ww / 2 - rectWidth / 2,
      config.wh / 2 - rectHeight / 2,
      rectWidth,
      rectHeight
    );
    let text3 = new Text(
      '1. Eat the bug. \n2. Avoid laser. \n3. Exit',
      config.fallbackFont
    );
    text3.position.set(
      config.ww / 2 - rectWidth / 2 + pad,
      config.wh / 2 - rectHeight / 2 + pad
    );
    let keyboard = new Sprite(utils.TextureCache['./assets/keyboard.png']);
    keyboard.position.set(
      config.ww / 2 + rectWidth / 4,
      config.wh / 2 - rectHeight / 2 + pad
    );
    let ok = new Sprite(utils.TextureCache['./assets/ok.png']);
    ok.position.set(config.ww / 2, config.wh / 2 + rectHeight / 2 - pad * 3);
    ok.anchor.set(0.5, 0.5);
    ok.buttonMode = true;
    ok.interactive = true;
    ok.on('click', () => {
      startCtn.removeChild(graphics, text3, ok);
      text1.visible = true;
      text2.visible = true;
      localStorage.setItem('hint', 'read');
    });
    startCtn.addChild(graphics, text3, keyboard, ok);
  } else {
    text1.visible = true;
    text2.visible = true;
  }
  this.app.stage.addChild(startCtn);
}
export { showStartScene };
