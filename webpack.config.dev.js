const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    devtool: 'inline-source-map',
    devServer: {
        historyApiFallback: {
            index: './viewsDev/index.html'
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            __PAM_SEARCH_API__: "'http://localhost:9000'",
            __PAM_STILLING__: "'/stilling/'",
            __PAM_CONTEXT_PATH__: "''"
        })
    ]
});
