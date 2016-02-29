var path = require('path');

module.exports = {
    devtool: 'source-map',

    entry: {
        main: [
            'webpack/hot/dev-server',
            'webpack-dev-server/client?http://localhost:8080',
            path.resolve(__dirname, 'src/main.js')
        ]
    },

    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public')
    },
    
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },

    modulesDirectories: [ 'node_modules' ]
};