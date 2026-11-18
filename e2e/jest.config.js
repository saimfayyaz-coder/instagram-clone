/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  rootDir: '..',
  testMatch: ['<rootDir>/e2e/**/*.test.ts'],
  testTimeout: 120000,
  maxWorkers: 1,
  globalSetup: 'detox/runners/jest/globalSetup',
  globalTeardown: 'detox/runners/jest/globalTeardown',
  reporters: [
    'detox/runners/jest/reporter',
    // JUnit XML report (artifacts/junit.xml): CI shows it as a pass/fail table
    [
      'jest-junit',
      {
        outputDirectory: 'artifacts',
        outputName: 'junit.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        addFileAttribute: 'true',
      },
    ],
  ],
  testEnvironment: 'detox/runners/jest/testEnvironment',
  verbose: true,
  moduleNameMapper: {
    // Same alias as the app, so tests can import TEST_IDS from '@/shared/constants'
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
