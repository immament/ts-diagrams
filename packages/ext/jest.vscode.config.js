const path = require('path');

/**@type {import('@jest/types/build/Config').ProjectConfig}*/
module.exports = {
  testMatch: ['<rootDir>/out/**/*.(test|spec).js'],
  testEnvironment: './test/vscode-environment.js',
  modulePaths: ['<rootDir>'],
  moduleNameMapper: {
    vscode: path.join(__dirname, 'test', 'vscode.js'),
  },
  reporters: ['<rootDir>/test/jestReporter.js'],
};
