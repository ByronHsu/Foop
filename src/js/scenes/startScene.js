import { Container, Text } from 'pixi.js';
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
  let startCtn = new Container();
  let text1 = new Text('Anonymous', { fill: 0xffffff });
  text1.anchor.set(0.5, 0.5);
  text1.x = config.ww / 2;
  text1.y = config.wh / 2 - 50;
  text1.interactive = true;
  text1.buttonMode = true;

  let text2 = new Text('Facebook Login', { fill: 0xffffff });
  text2.anchor.set(0.5, 0.5);
  text2.x = config.ww / 2;
  text2.y = config.wh / 2;
  text2.interactive = true;
  text2.buttonMode = true;
  let buttons = [
    {
      text: text1,
      press: () => {
        this.app.stage.removeChild(startCtn);
        this.onResumeScene();
      },
    },
    {
      text: text2,
      press: () => {
        FB.login(response => { // eslint-disable-line
          if (response.status === 'connected') {
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
  this.app.stage.addChild(startCtn);
}
export { showStartScene };
