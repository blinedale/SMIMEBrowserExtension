module.exports = {
  entry: ["babel-polyfill", './src/background-scripts/background.js'],
  output: {
    filename: './build/tmp/background-scripts/background-bundle.js'
  }
};
