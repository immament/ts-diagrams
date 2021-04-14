/**@type {import('@jest/types/build/Config').ProjectConfig}*/
module.exports = {
  preset: 'ts-jest',
  testMatch: ['<rootDir>/src/**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)'],
  testEnvironment: 'node',
  moduleNameMapper: {
    'src/(.*)': '<rootDir>/src/$1',
  },
  automock: false,
  watchPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist'],
  globals: {
    window: {},
  },
};
