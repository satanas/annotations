var path = require('path');

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: './app/client/index.js',
    output: {
      path: path.join(__dirname, 'public'),
      filename: 'client.js'
    },
    module: {
        loaders: [
            {
              test: /\.hbs$/,
              loader: 'handlebars-loader'
            },
            {
              test: /\.jsx?$/,
              exclude: /(node_modules|bower_components)/,
              loaders: ['babel']
            }
        ]
    }
};
