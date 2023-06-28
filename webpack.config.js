const path = require('path');
//import * as url from 'url';

//const __dirname = fileURLToPath(new URL('.', import.meta.url));
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: path.resolve(__dirname, './src/index.ts'),

  mode: 'production',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        include: [path.resolve(__dirname, './src')],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
  },
  plugins: [
    new Dotenv(),
    new NodePolyfillPlugin({ includeAliases: ['http', 'os', 'url', 'process', 'path', 'stream'] }),
  ],

  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
};
