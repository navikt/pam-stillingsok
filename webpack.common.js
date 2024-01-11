// eslint-disable-next-line import/no-extraneous-dependencies
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    devtool: "source-map",
    entry: {
        sok: ["@babel/polyfill", "whatwg-fetch", "./src/app.jsx"],
        inter: "./src/fonts/inter.css",
    },
    output: {
        path: `${__dirname}/dist`,
        filename: "js/[name].js",
        publicPath: "/sok/",
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                    },
                },
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: "css-loader",
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: [".js", ".jsx"],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "css/[name].css",
        }),
        new CopyPlugin({
            patterns: [
                { from: "public", to: "public" }, //to the dist root directory
            ],
        }),
    ],
};
