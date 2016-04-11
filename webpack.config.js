var path = require('path');

var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/app/index.html',
  filename: 'index.html',
  inject: 'body'
});

var config = {
  devtool: 'source-map',

  entry: [
    path.resolve(__dirname, 'app/main.js'),
    path.resolve(__dirname, 'app/assets/scss/main.scss')
  ],

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
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
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
    }),
    new OpenBrowserPlugin({
      url: 'http://localhost:8080'
    })
  ]
};

module.exports = config;