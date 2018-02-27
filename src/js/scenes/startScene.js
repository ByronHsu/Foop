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

  let anonyText = new Text('Anonymous', config.fallbackFont);
  anonyText.anchor.set(0.5, 0.5);
  anonyText.x = config.ww / 2;
  anonyText.y = config.wh / 2 - 50;
  anonyText.interactive = true;
  anonyText.buttonMode = true;
  anonyText.visible = false;

  let FBText = new Text('Facebook Login', config.fallbackFont);
  FBText.anchor.set(0.5, 0.5);
  FBText.x = config.ww / 2;
  FBText.y = config.wh / 2;
  FBText.interactive = true;
  FBText.buttonMode = true;
  FBText.visible = false;
  let buttons = [
    {
      text: anonyText,
      press: () => {
        this.app.stage.removeChild(startCtn);
        localStorage.setItem('username', 'Anonymous');
        localStorage.setItem('userid', '');
        this.onResumeScene();
      },
    },
    {
      text: FBText,
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
    let hintModal = new Container();
    const { rectWidth, rectHeight, pad } = config.hintModal;
    let graphics = new Graphics();
    graphics.lineStyle(5, config.lineColor[0], 1);
    graphics.beginFill(config.bgColor, 1);
    graphics.drawRect(0, 0, rectWidth, rectHeight);
    let hintText = new Text(
      '1. Eat the bug. \n2. Avoid laser. \n3. Exit',
      config.fallbackFont
    );
    hintText.position.set(pad, pad);
    let keyboard = new Sprite(utils.TextureCache['./assets/keyboard.png']);
    keyboard.anchor.set(1, 0);
    keyboard.position.set(rectWidth - pad, pad);
    let ok = new Sprite(utils.TextureCache['./assets/ok.png']);
    ok.position.set(rectWidth / 2, rectHeight - pad);
    ok.anchor.set(0.5, 1);
    ok.buttonMode = true;
    ok.interactive = true;
    ok.on('click', () => {
      hintModal.removeChild(graphics, hintText, ok);
      anonyText.visible = true;
      FBText.visible = true;
      localStorage.setItem('hint', 'read');
    });
    hintModal.addChild(graphics, hintText, keyboard, ok);
    hintModal.position.set(
      config.ww / 2 - rectWidth / 2,
      config.wh / 2 - rectHeight / 2
    ); // Center the container
    startCtn.addChild(hintModal);
  } else {
    anonyText.visible = true;
    FBText.visible = true;
  }
  this.app.stage.addChild(startCtn);
}
export { showStartScene };
