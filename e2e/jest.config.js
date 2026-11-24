/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  rootDir: '..',
  testMatch: ['<rootDir>/e2e/**/*.test.ts'],
  testTimeout: 120000,
  maxWorkers: 1,
  // Wrap Detox's setup/teardown: create a run id + clean old test users, then delete this run's users
  globalSetup: '<rootDir>/e2e/support/globalSetup.ts',
  globalTeardown: '<rootDir>/e2e/support/globalTeardown.ts',
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
