const path = require('path');

module.exports = {
  testMatch: ['<rootDir>/out/**/*.(test|spec).js'],
  testEnvironment: './vscode-environment.js',
  modulePaths: ['<rootDir>'],
  moduleNameMapper: {
    vscode: path.join(__dirname, 'vscode.js'),
  },
  reporters: ['<rootDir>/jestReporter.js'],
};
