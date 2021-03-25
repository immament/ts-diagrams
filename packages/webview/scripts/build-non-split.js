const path = require('path');
const rewire = require('rewire');
const defaults = rewire('react-scripts/scripts/build.js');

const config = defaults.__get__('config');

config.resolve.alias['common'] = path.resolve(__dirname, '../../common/src');
console.log(config.resolve);

config.optimization.splitChunks = {
  cacheGroups: {
    default: false,
  },
};

config.optimization.runtimeChunk = false;
config.optimization.minimize = false;

// // JS
// config.output.filename = 'static/js/[name].js';
// // CSS. "5" is MiniCssPlugin
// config.plugins[5].options.filename = 'static/js/[name].css';
// config.plugins[5].options.publicPath = '../';
