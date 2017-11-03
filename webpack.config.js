module.exports = {
  entry: ['babel-polyfill', './src/content-scripts/main.js'],
  output: {
    filename: './build/tmp/content-scripts/cs-bundle.js'
  },
  module: {
    rules: [
      {
        // Skip any files outside of `src` directory
        include: /src/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['es2015', {modules: false}]],
            plugins: ['transform-runtime']
          }
        }
      }
    ]
  }
};
