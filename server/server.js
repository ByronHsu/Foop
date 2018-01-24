const express = require('express');
const config = require('./config');
const webpack = require('webpack');
const path = require('path');
const server = express();
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

server.use(express.static('public'));

server.listen(config.port, config.host, () => {
  console.info('Express listening on port', config.port);
});
