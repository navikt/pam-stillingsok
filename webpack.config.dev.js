const merge = require("webpack-merge");
const common = require("./webpack.common.js");

const environment = "development";

module.exports = merge(common, {
    mode: environment,
    watchOptions: {
        ignored: /node_modules/,
    },
    devtool: "inline-source-map",
});
