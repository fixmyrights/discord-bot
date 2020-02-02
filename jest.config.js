module.exports = {
  moduleFileExtensions: ['js', 'json'],
  testEnvironment: 'node',
  resetModules: true,
  moduleNameMapper: {
    '^src(.*)$': '<rootDir>/src/$1',
    '^test(.*)$': '<rootDir>/test/$1'
  },
  testMatch: ['<rootDir>/src/**/*.spec.js'],
  rootDir: '.',
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.js'],
  reporters: ['default', 'jest-junit']
};
