var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: __dirname + '/src/index.html',
    filename: 'index.html',
    inject: 'body'
});

module.exports = {
    devtool: 'eval',

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
            }
        ]
    },

    plugins: [HtmlWebpackPluginConfig],

    modulesDirectories: [ 'node_modules' ]
};