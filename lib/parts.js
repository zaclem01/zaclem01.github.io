const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

exports.minify = function() {
    return {
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                compressor: {
                    warnings: false
                }
            })
        ]
    };
};

exports.loadPug = function() {
    return {
        module: {
            loaders: [
                {
                    test: /\.pug$/,
                    loader: 'pug'
                }
            ]
        }
    };
};

exports.loadCSS = function(paths) {
    return {
        module: {
            loaders: [
                {
                    test: /\.scss$/,
                    loaders: ['style', 'css', 'postcss', 'sass'],
                    include: paths
                }
            ]
        },
        postcss: function() {
            return [autoprefixer];
        }
    };
};

exports.splitBundles = function(name, entries) {
    let entry = {};
    entry[name] = entries;
    return {
        entry: entry,
        plugins: [
            new webpack.optimize.CommonsChunkPlugin({
                names: [name, 'manifest']
            })
        ]
    };
};

exports.extractSCSS = function(paths) {
    return {
        module: {
            loaders: [
                {
                    test: /\.scss$/,
                    loader: ExtractTextPlugin.extract('style', 'css!postcss!sass'),
                    include: paths
                }
            ]
        },
        plugins: [
            new ExtractTextPlugin('[name].css')
        ]
    };
};

exports.devServer = function(host, port) {
    return {
        // watchOptions: {
        //     aggregateTimeout: 300,
        //     poll: 100
        // },
        devServer: {
            historyApiFallback: true,
            hot: true,
            inline: true,
            stats: 'errors-only',
            host: host,
            port: port
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin({
                multistep: true
            })
        ]
    };
}