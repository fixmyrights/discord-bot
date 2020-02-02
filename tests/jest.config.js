module.exports = {
  moduleFileExtensions: ['js', 'json'],
  testEnvironment: 'node',
  moduleNameMapper: {
    '^src(.*)$': '<rootDir>/../src/$1'
  },
  setupFiles: ['./setup.js'],
  testRegex: '.feature.js$',
  rootDir: '.',
  reporters: ['default', 'jest-junit']
};
