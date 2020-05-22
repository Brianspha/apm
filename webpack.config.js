const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    target: 'node',
    entry: {
        app: ''
    },
    output: {
        filename: '[name].js',
        path: '',
        library: '???',
        libraryTarget: 'commonjs'
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new UglifyJSPlugin({
            uglifyOptions: {
                beautify: false,
                ecma: 6,
                compress: true,
                comments: false
            }
        }),
    ]
};