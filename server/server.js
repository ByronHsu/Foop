const express = require('express');
const config = require('./config');
const path = require('path');
const server = express();
const apiRouter = require('./api/routes');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');

server.use(
  session({ secret: 'foop_sign', resave: false, saveUninitialized: false })
);

if (process.env.NODE_ENV === 'dev') {
  const webpack = require('webpack');
  const WebpackDevMiddleware = require('webpack-dev-middleware');
  const WebpackHotMiddleware = require('webpack-hot-middleware');
  const webpackDevConfig = require('../webpack.config.dev');
  const compiler = webpack(webpackDevConfig);
  server.use(
    WebpackDevMiddleware(compiler, {
      publicPath: webpackDevConfig.output.publicPath,
      stats: { colors: true },
    })
  );

  server.use(
    WebpackHotMiddleware(compiler, {
      log: console.log,
    })
  );

  server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });
} else {
  server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });
}

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/foop');

server.use(bodyParser.json());

apiRouter(server);

server.use(express.static('public'));

server.listen(config.port, config.host, () => {
  console.info('Express listening on port', config.port);
});
