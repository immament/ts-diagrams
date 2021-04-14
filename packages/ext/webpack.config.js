//@ts-check

'use strict';

const path = require('path');

/**@type {import('webpack').Configuration}*/
const extensionConfig = {
  target: 'node',
  mode: 'none',

  // the entry point of this extension, 📖 -> https://webpack.js.org/configuration/entry-context/
  entry: {
    extension: './src/extension.ts',
    //webview: './src/webview/index.ts',
  },
  output: {
    // the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
    path: path.resolve(__dirname, 'dist'),
    filename: pathData => {
      return pathData.chunk.name === 'webview' ? 'web/webview.js' : '[name].js';
    },
    libraryTarget: 'commonjs2',
  },
  devtool: 'nosources-source-map',
  externals: {
    vscode: 'commonjs vscode', // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
  },
  resolve: {
    // -> https://github.com/TypeStrong/ts-loader
    extensions: ['.ts', '.js'],
    alias: {
      common: path.resolve(__dirname, '../common/src'),
      '@common': path.resolve(__dirname, '../extractor/src/common'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            projectReferences: true,
            transpileOnly: false,
            configFile: 'tsconfig.build.json',
          },
        },
      },
    ],
  },

  infrastructureLogging: {
    level: 'log',
  },
};

/**@type {import('webpack').Configuration}*/
const webviewConfig = {
  target: 'es5',
  mode: 'none',

  // the entry point of this extension, 📖 -> https://webpack.js.org/configuration/entry-context/
  entry: {
    webview: './src/webview/index.ts',
  },
  output: {
    // the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
    path: path.resolve(__dirname, 'dist'),
    filename: 'web/webview-init.js',
  },
  devtool: 'nosources-source-map',
  resolve: {
    // -> https://github.com/TypeStrong/ts-loader
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            projectReferences: true,
            transpileOnly: false,
            configFile: 'tsconfig.build.json',
          },
        },
      },
    ],
  },
};

module.exports = [extensionConfig, webviewConfig];
