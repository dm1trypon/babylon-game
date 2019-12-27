const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: './src/entry.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  target: 'web',
};
