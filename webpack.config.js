const { resolve } = require('path');

var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

var config = {
  devtool: 'cheap-module-eval-source-map',

  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './main.js',
    './assets/scss/main.scss'
  ],

  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'dist'),
    publicPath: '/',
  },

  context: resolve(__dirname, 'app'),

  devServer: {
    hot: true,
    contentBase: resolve(__dirname, 'dist'),
    publicPath: '/'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loaders: [
          'babel-loader',
        ],
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: "style-loader",
          loader: [
            'css-loader',
            {
              loader: 'sass-loader',
              query: {
                sourceMap: false,
              }
            }
            ]
        })
      },
      // {
      //   test: /\.(png|jpg)$/,
      //   loader: 'url?limit=15000'
      // }
    ]
  },

  plugins: [
    // HtmlWebpackPluginConfig,
    new ExtractTextPlugin({ filename: 'style.css', disable: false, allChunks: true}),
    new CopyWebpackPlugin([{ from: 'vendors', to: 'vendors' }]),
    new OpenBrowserPlugin({ url: 'http://localhost:8080' }),
    new webpack.HotModuleReplacementPlugin(),
  ]
};

module.exports = config;