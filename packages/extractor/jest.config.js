/**@type {import('@jest/types/build/Config').ProjectConfig}*/
const config = {
  //preset: 'ts-jest',
  transform: {'\\.[jt]sx?$': ['babel-jest', {cwd: __dirname}]},
  testMatch: ['<rootDir>/src/**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)'],
  testEnvironment: 'node',
  moduleNameMapper: {
    'src/(.*)': '<rootDir>/src/$1',
    '@common/(.*)': '<rootDir>/src/common/$1',
  },
  modulePathIgnorePatterns: ['<rootDir>/dist'],
  automock: false,
  watchPathIgnorePatterns: ['<rootDir>/node_modules/', 'watch-test-dir'],
  coveragePathIgnorePatterns: ['__tests__', 'node_modules'],
};

module.exports = config;
