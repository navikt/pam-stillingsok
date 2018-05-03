const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        kart: ['babel-polyfill', 'whatwg-fetch', './src/kart/kart.js'],
        sok: ['babel-polyfill', 'whatwg-fetch', './src/sok/sok.js'],
        stilling: ['babel-polyfill', 'whatwg-fetch', './src/stilling/stilling.js'],
        googletagmanager: ['./src/googletagmanager.js']
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
                test: /\.(png|jpg|gif|svg)$/,
                include: [
                    path.resolve(__dirname, 'node_modules/leaflet') // Vi trenger ikke kartikonene fra leaflet
                ],
                loader: 'ignore-loader'
            }, {
                test: /\.(png)$/,
                loader: 'base64-image-loader'
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
