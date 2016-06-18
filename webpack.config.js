var path = require('path');

module.exports = {
    entry: './tenuki/app.js',
    resolve: {
        extensions: ['', '.js']
    },
    output: {
        publicPath: '/',
        path: 'build/',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.scss$/,
                loaders: ['style', 'css', 'sass'],
            },
            {
                test: /\.js$/,
                loader: 'babel',
                include: [
                    path.resolve(__dirname, 'tenuki')
                ]
            }
        ]
    }
};
