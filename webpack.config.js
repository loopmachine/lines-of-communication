var webpack = require('webpack');

module.exports = {
    entry: {
        app: ['webpack/hot/dev-server', './src/main.js']
    },
    output: {
        path: './dist',
        filename: 'bundle.js'
    },
    module: {
        loaders: [{
            test: /\.js(x?)$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }, {
            test: /\.json$/,
            exclude: /node_modules/,
            loader: 'json-loader'
        }, {
            test: /\.less$/,
            exclude: /node_modules/,
            loader: 'style-loader!css-loader!less-loader'
        }]
    }
};
