// Disables code splitting into chunks
// See https://github.com/facebook/create-react-app/issues/5306#issuecomment-433425838

const rewire = require('rewire');
const defaults = rewire('react-scripts/scripts/build.js');
const config = defaults.__get__('config');

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
