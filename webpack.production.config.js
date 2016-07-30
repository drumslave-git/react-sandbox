var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/app/index.html',
  filename: 'index.html',
  inject: 'body'
});

var config = {
  devtool: 'cheap-module-source-map',

  entry: [
    path.resolve(__dirname, 'app/main.js'),
    path.resolve(__dirname, 'app/assets/scss/main.scss')
  ],

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },

  devServer: {
    outputPath: path.join(__dirname, 'dist')
  },

  module: {
    loaders: [
      {
        test: /\.js?$/,
        include: path.resolve(__dirname, 'app'),
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader!sass-loader'})
      }
    ]
  },

  plugins: [
    HtmlWebpackPluginConfig,
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({comments: false}),
    new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('production') } }),
    new ExtractTextPlugin("style.css", {allChunks: false}),
    new CopyWebpackPlugin([{ from: 'app/vendors', to: 'vendors' }])
  ]
};

module.exports = config;