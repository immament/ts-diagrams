/**@type {import('@jest/types/build/Config').ProjectConfig}*/
module.exports = {
  preset: 'ts-jest',
  testMatch: ['<rootDir>/src/**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)'],
  testEnvironment: 'jsdom',
  moduleDirectories: ['node_modules'],
  //setupFiles: ['<rootDir>/src/test/unit/setupTests.ts'],
};
