const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        sok: ['babel-polyfill', 'whatwg-fetch', './src/app.js']
    },
    output: {
        path: `${__dirname}/dist`,
        filename: 'js/[name].js',
        publicPath: '/sok/'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: { presets: ['es2015', 'react', 'stage-2'] }
            }, {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            }, {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        'less-loader?{"globalVars":{"nodeModulesPath":"\'./../../\'", "coreModulePath":"\'./../../\'"}}'
                    ]
                })
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    plugins: [
        new ExtractTextPlugin('css/[name].css')
    ]
};
