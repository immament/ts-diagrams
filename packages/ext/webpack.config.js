'use strict';

const path = require('path');

/**@type {import('webpack').Configuration}*/
const extensionConfig = {
  target: 'node',
  mode: 'none',

  entry: {
    extension: './src/extension.ts',
  },
  output: {
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
      '@common': path.resolve(__dirname, '../extractor/src/common'),
    },
  },
  module: {
    rules: [tsLoaderModuleRule()],
  },

  infrastructureLogging: {
    level: 'log',
  },
};

/**@type {import('webpack').Configuration}*/
const webviewConfig = {
  target: 'es5',
  mode: 'none',

  entry: {
    webview: './src/webview/index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist', 'web'),
    filename: 'webview-init.js',
  },
  devtool: 'nosources-source-map',
  resolve: {
    // -> https://github.com/TypeStrong/ts-loader
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [tsLoaderModuleRule()],
  },
};

module.exports = [extensionConfig, webviewConfig];

function tsLoaderModuleRule() {
  /**@type {import('webpack').RuleSetRule}*/
  const rule = {
    test: /\.ts$/,
    use: {
      loader: 'ts-loader',
      options: {
        projectReferences: true,
        transpileOnly: false,
        configFile: 'tsconfig.build.json',
      },
    },
  };
  return rule;
}
