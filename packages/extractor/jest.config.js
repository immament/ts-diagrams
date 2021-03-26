module.exports = {
  preset: 'ts-jest',
  testMatch: ['<rootDir>/src/**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)'],
  testEnvironment: 'node',

  moduleNameMapper: {
    'src/(.*)': '<rootDir>/src/$1',
  },
};
