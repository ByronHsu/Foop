const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
// const Jarvis = require('webpack-jarvis');
const DashboardPlugin = require('webpack-dashboard/plugin');

module.exports = {
  entry: {
    bundle: [
      'webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr&reload=true',
      './src/index.js',
    ],
  },
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'public'),
    publicPath: '/',
  },
  devtool: 'eval',
  resolve: {
    extensions: ['.js'],
  },
  module: {
    loaders: [
      { test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: "file-loader",
        options: {
          name: "assets/fonts/[name].[ext]",
        }
      },
      {
        test: /\.html$/,
        loader: "raw-loader" // for html hot-load
      }
    ],
  },
  plugins: [
    new DashboardPlugin(),
    new HtmlWebpackPlugin({
      // title: 'Foop! | dev',
      template: './src/template.html',
      filename: 'index.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin([{ from: 'src/assets', to: 'assets' }]),
    new OpenBrowserPlugin({ url: 'http://localhost:3000' }),
  ],
};
