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
            __PAM_FORSIDE__: "'/forside'",
            __PAM_MINSIDE__: "'/minSide'",
            __PAM_IS_TOKEN_VALID__: "'/valid'",
            __PAM_LOGOUT__: "'/logout'",
            __PAM_STILLING__: "'/stilling/'"
})
    ]
});
