const path               = require('path');
const webpack            = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CompressionPlugin  = require('compression-webpack-plugin');
const ExtractTextPlugin  = require('extract-text-webpack-plugin');

module.exports = function exports(env)
{
    const outputPath = path.resolve(__dirname, 'test/webpack');

    return {
        context: __dirname,
        entry: {
            display: './test/display.js',
            qunit:   './test/qunit.js',
        },
        output: {
            path:          outputPath,
            filename:      '[name].js',
            publicPath:    '/bs/webpack/',
            chunkFilename: '[name].js',
            pathinfo:      true,
        },
        module: {
            rules: [
                {test: /\.css$/, use: ExtractTextPlugin.extract({use: 'css-loader'})},

                // These packages need explicit imports.
                {test: /bootstrap/, use: 'imports-loader?jQuery=jquery'},
                {test: /mobiscroll/, use: 'imports-loader?jQuery=jquery'},
                //{test: /backstrap/, use: 'imports-loader?jquery,underscore,backbone,moment'},
            ]
        },
        resolve: {
            modules: [
                __dirname,
                path.resolve(__dirname, 'node_modules'),
            ],
            extensions: ['.js', '.css'],
        },
        plugins: [
            new CleanWebpackPlugin(outputPath, {verbose: false}),
            new webpack.HashedModuleIdsPlugin(),
            new webpack.optimize.LimitChunkCountPlugin({maxChunks: 1}),
            new webpack.IgnorePlugin(/\/locale$/, /^moment/),
            new ExtractTextPlugin({filename: 'styles.css', allChunks: true}),
        ],
    };
};
