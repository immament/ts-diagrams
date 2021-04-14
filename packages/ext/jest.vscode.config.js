const path = require('path');

/**@type {import('@jest/types/build/Config').ProjectConfig}*/
module.exports = {
  testMatch: ['<rootDir>/out/**/*.(test|spec).js'],
  testEnvironment: './vscode-environment.js',
  modulePaths: ['<rootDir>'],
  moduleNameMapper: {
    vscode: path.join(__dirname, 'vscode.js'),
  },
  reporters: ['<rootDir>/jestReporter.js'],
};
