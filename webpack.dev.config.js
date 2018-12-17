const { resolve } = require('path');

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const config = {
    stats: {
        maxModules: 0,
    },
    mode: 'development',
    devtool: 'source-map',

    entry: [
        'react-hot-loader/patch',
        `webpack-dev-server/client?http://localhost:${process.env.PORT || 9090}`,
        'webpack/hot/only-dev-server',
        './main.js',
        './assets/scss/main.scss',
    ],

    output: {
        filename: 'bundle.js',
        path: resolve(__dirname, 'dist'),
        publicPath: '',
    },

    context: resolve(__dirname, 'app'),

    devServer: {
        hot: true,
        contentBase: resolve(__dirname, 'build'),
        historyApiFallback: true,
        publicPath: '/',
        port: process.env.PORT || 9090,
        proxy: {
            '/api': {
                target: 'https://redmine.enaikoon.de',
                changeOrigin: true,
                pathRewrite: { '^/api': '' },
                secure: false,
            },
        },
    },

    resolve: {
        extensions: ['.js', '.jsx'],
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                loader: ['style-loader', 'css-loader'],
            },
            {
                enforce: 'pre',
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-react'],
                        },
                    },
                ],
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        {
                            loader: 'sass-loader',
                            query: {
                                sourceMap: false,
                            },
                        },
                    ],
                    publicPath: '../',
                })),
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            mimetype: 'image/png',
                            name: 'images/[name].[ext]',
                        },
                    },
                ],
            },
            {
                test: /\.eot(\?v=\d+.\d+.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'fonts/[name].[ext]',
                        },
                    },
                ],
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            mimetype: 'application/font-woff',
                            name: 'fonts/[name].[ext]',
                        },
                    },
                ],
            },
            {
                test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            mimetype: 'application/octet-stream',
                            name: 'fonts/[name].[ext]',
                        },
                    },
                ],
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            mimetype: 'image/svg+xml',
                            name: 'images/[name].[ext]',
                        },
                    },
                ],
            },
        ],
    },

    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.LoaderOptionsPlugin({
            test: /\.jsx?$/,
            options: {
                eslint: {
                    configFile: resolve(__dirname, '.eslintrc'),
                    cache: false,
                },
            },
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new ExtractTextPlugin({ filename: './styles/style.css', disable: false, allChunks: true }),
        new CopyWebpackPlugin([{ from: 'vendors', to: 'vendors' }]),
        new OpenBrowserPlugin({ url: 'http://localhost:9090' }),
        new webpack.HotModuleReplacementPlugin(),
    ],
};

module.exports = config;
