var path = require('path');

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/src/index.html',
  filename: 'index.html',
  inject: 'body'
});

var config = {
  devtool: 'source-map',

  entry: path.resolve(__dirname, 'src/main.js'),

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public')
  },

  module: {
    loaders: [
      {
        test: /\.js?$/,
        include: path.resolve(__dirname, 'src'),
        loaders: ['react-hot', 'babel']
      },
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, 'src/assets/scss'),
        loader: 'style!css!sass'
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url?limit=15000'
      }
    ]
  },

  plugins: [HtmlWebpackPluginConfig]
};

if (process.env.NODE_ENV === 'production') {
  config.plugins = [
    HtmlWebpackPluginConfig,
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({comments: false}),
    new webpack.DefinePlugin({
      'process.env': {NODE_ENV: JSON.stringify('production')}
    })
  ]
}

module.exports = config;