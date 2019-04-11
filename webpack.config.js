const path = require('path');
const esay = require('./index.js');

module.exports = {
  entry: './example/index.js',
  mode: 'development',
  output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-env'],
          plugins: [
            [
              esay,
              {
                start: 'xx',
                end: 'xx'
              }
            ]
          ]
        }
      },
    ]
  }
};