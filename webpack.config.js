var path = require('path');

var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/app/index.html',
  filename: 'index.html',
  inject: 'body'
});

var config = {
  devtool: 'source-map',

  entry: path.resolve(__dirname, 'app/main.js'),

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public')
  },

  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, 'app'),
        loaders: ['react-hot', 'babel']
      },
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, 'app/assets/scss'),
        loader: ExtractTextPlugin.extract('css!sass')
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url?limit=15000'
      }
    ]
  },

  plugins: [
    HtmlWebpackPluginConfig,
    new ExtractTextPlugin('styles/style.css', {
      allChunks: true
    })
  ]
};

module.exports = config;