module.exports = {
  preset: '@react-native/jest-preset',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    // Path aliases
    '^@/(.*)$': '<rootDir>/src/$1',
    // Replace react-native-config's native module with a safe JS mock
    '^react-native-config$': '<rootDir>/__mocks__/react-native-config.ts',
  },
  transformIgnorePatterns: [
    'node_modules/(?!' +
      [
        'react-native',
        '@react-native',
        '@react-native-community',
        '@react-navigation',
        'react-native-keyboard-controller',
        'react-native-reanimated',
        'react-native-bootsplash',
        'react-native-safe-area-context',
        'react-native-screens',
        'react-native-vector-icons',
        'react-native-size-matters',
        'react-native-mmkv',
        'react-native-keychain',
        'react-native-localize',
        'react-native-config',
      ].join('|') +
      ')/',
  ],
};
