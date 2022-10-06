const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const devMode = process.env.NODE_ENV !== "production";

module.exports = {
    devtool: "source-map",
    entry: {
        sok: ["babel-polyfill", "whatwg-fetch", "./src/app.js"]
    },
    output: {
        path: `${__dirname}/dist`,
        filename: "js/[name].js",
        publicPath: "/sok/"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["es2015", "react", "stage-2"]
                    }
                }
            },
            {
                test: /\.(le|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "less-loader"
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: [".js", ".jsx"]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "css/[name].css"
        })
    ]
};
