/**
 * @file Webpack basic configuration file.
 */

const path = require('path')

// const commons = ['react', 'react-dom', 'react-router', 'react-router-dom']
const otherConfig = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js'],
  },
  devtool: 'source-map',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: {
                  browsers: ['last 4 versions', 'Firefox ESR', '> 0.25%', 'ie >= 9'],
                },
              },
            ],
            '@babel/preset-react',
          ],
          plugins: [
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            ['@babel/plugin-proposal-class-properties', { loose: true }],
            '@babel/plugin-syntax-dynamic-import',
            '@babel/plugin-transform-runtime',
          ],
        },
      },
    ],
  },
}
module.exports = [{
  entry: {
    back: './server.js',
  },
  target: 'node',
  ...otherConfig,
}, {
  entry: {
    main: './client.js',
  },
  ...otherConfig,
}]
