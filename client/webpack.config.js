const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'production', // for production
    // mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, '../public'),
        filename: 'bundle.js',
    },
    devServer: {
        static: {
            directory: path.join(__dirname, '../public'),
        },
        port: 3000,
        open: true,
        hot: true,
        compress: true,
        historyApiFallback: true,
        devMiddleware: {
            writeToDisk: true,
        },
        proxy: [
            {
                context: ['/api'],
                target: 'http://localhost:5001',
                changeOrigin: true,
                secure: false,
            },
        ],
    },
    module: {
        rules: [
            {
                test: /\.css$/, // looks for all the file ending with .css
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Tasks',
            filename: 'index.html',
            template: './src/index.html',
        }),
        new MiniCssExtractPlugin({
            filename: 'style.css',
        }),
    ],
};