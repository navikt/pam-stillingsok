const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = () => {
    return (
        merge(common, {
            plugins: [
                new webpack.DefinePlugin({
                    'process.env.NODE_ENV': JSON.stringify('production')
                }),
                /* Optimize bundle load time */
                new webpack.optimize.ModuleConcatenationPlugin(),
                new UglifyJSPlugin()
            ]
        })
    );
};
