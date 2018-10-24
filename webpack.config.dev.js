const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const environment = 'development';

module.exports = merge(common, {
    mode: environment,

    devtool: 'inline-source-map',
    devServer: {
        historyApiFallback: {
            index: './viewsDev/index.html'
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            __PAM_SEARCH_API__: "'http://localhost:9000'",
            __PAM_AD_USER_API__: "'http://localhost:9017/aduser'",
            __PAM_STILLING__: "'/stilling/'",
            __PAM_CONTEXT_PATH__: "''",
            __LOGIN_URL__: "''",
            __LOGOUT_URL__: "''"
        })
    ]
});
