const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    optimization: {
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true
                }
            }
        }
    },
    entry: {
        sok: ['babel-polyfill', 'whatwg-fetch', './src/app.js'],
        print: ['babel-polyfill', 'whatwg-fetch', './src/print.js'],
        googleanalytics: ['./src/googleanalytics.js']
    },
    output: {
        path: `${__dirname}/dist`,
        filename: 'js/[name].js',
        publicPath: '/sok/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015', 'react', 'stage-2']
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.less$/,
                loader: 'style-loader!css-loader!less-loader?{"globalVars":{"nodeModulesPath":"\'./../../\'", "coreModulePath":"\'./../../\'"}}'
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
        })
    ]
};
