const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const environment = 'production';

module.exports = merge(common, {
    mode: environment,

    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(environment)
        }),
        /* Optimize bundle load time */
        new webpack.optimize.ModuleConcatenationPlugin(),
    ]
});
