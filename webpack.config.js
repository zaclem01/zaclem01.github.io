const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const validate = require('webpack-validator');

const HTMLWebpackPlugin = require('html-webpack-plugin');

const parts = require('./lib/parts.js');

const PATHS = {
    app: path.join(__dirname, 'src', 'js'),
    style: path.join(__dirname, 'src', 'styles', 'main.scss'),
    views: path.join(__dirname, 'src', 'views'),
    images: path.join(__dirname, 'src', 'images'),
    build: path.join(__dirname, 'build')
}

const common = {
    entry: {
        app: PATHS.app,
        style: PATHS.style
    },
    output: {
        path: PATHS.build,
        publicPath: '',
        filename: '[name].[hash].bundle.js'
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new HTMLWebpackPlugin({
            filename: 'index.html',
            template: path.join(PATHS.views, 'home.pug')
        })
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel'],
                include: PATHS.app
            },
            {
                test: /\.(svg|ttf|woff|gif|eot)$/,
                loader: 'url?limit=30000&name=[name]-[hash].[ext]',
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'file?name=[name].[hash].[ext]',
                include: PATHS.images
            }
        ]
    }
};

let config;

switch(process.env.npm_lifecycle_event) {
    case 'build':
        config = merge(
            common,
            parts.minify(),
            parts.splitBundles('vendor', ['jquery']),
            parts.loadPug(),
            parts.extractSCSS(PATHS.style),
            {
                devtool: 'source-map'
            }
        );
        break;
    default:
        config = merge(
            common,
            parts.loadPug(),
            parts.loadCSS(PATHS.style),
            parts.devServer(process.env.HOST, process.env.PORT),
            {
                devtool: 'eval-source-map'
            }
        );
        break;
}

module.exports = validate(config);