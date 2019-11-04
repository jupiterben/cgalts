const path = require('path');

module.exports = {
    mode: "production",
    entry: './src/api.ts',
    devtool: "source-map",

    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'index.js',
        libraryTarget: 'umd',
        globalObject: 'this',
        libraryExport: 'default',
        library: 'geometric',
        libraryTarget: 'umd',
    },
    externals: {

    },
    optimization: {
        minimize: true,
        mergeDuplicateChunks: true,
        removeEmptyChunks: true,
    },
    plugins: [
    ],
    module: {
        rules: [{
            test: /\.ts$/,
            loaders: 'awesome-typescript-loader'
        },
        ]
    }
};