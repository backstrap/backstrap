const path               = require('path');
const webpack            = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin  = require('extract-text-webpack-plugin');

module.exports = function exports(env)
{
    const outputPath = path.resolve(__dirname, 'test/webpack');

    return {
        context: __dirname,
        entry: {
            display: './test/display.js',
            jasmine: './test/jasmine.js'
        },
        output: {
            path:          outputPath,
            filename:      '[name].js',
            publicPath:    '/bs/webpack/',
            chunkFilename: '[name].js',
            pathinfo:      true
        },
        module: {
            rules: [
                {test: /\.css$/, use: ExtractTextPlugin.extract({use: 'css-loader'})},

                // These packages need explicit imports.
                {test: /bootstrap/, use: 'imports-loader?jQuery=jquery'},
                //{test: /backstrap/, use: 'imports-loader?jquery,underscore,backbone,moment'},
                // for bootstrap...
                {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff'},
                {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream'},
                {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader'},
                {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml'}
            ]
        },
        resolve: {
            modules: [
                __dirname,
                path.resolve(__dirname, 'node_modules')
            ],
            extensions: ['.js', '.css'],
            alias: {
                'jasmine-core': path.resolve(__dirname, 'node_modules/jasmine-core/lib/jasmine-core')
            }
        },
        plugins: [
            new CleanWebpackPlugin(outputPath, {verbose: false}),
            new webpack.HashedModuleIdsPlugin(),
            new webpack.optimize.LimitChunkCountPlugin({maxChunks: 1}),
            new webpack.IgnorePlugin(/\/locale$/, /^moment/),
            new webpack.ProvidePlugin({jasmineRequire: 'jasmine-core/jasmine'}),
            new ExtractTextPlugin({filename: 'styles.css', allChunks: true})
        ]
    };
};
