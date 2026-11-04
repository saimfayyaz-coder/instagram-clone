module.exports = {
  root: true,
  extends: '@react-native',
  overrides: [
    {
      // App code uses the UI kit; only shared/ui may wrap React Native primitives
      files: ['src/**/*.ts', 'src/**/*.tsx'],
      excludedFiles: ['src/shared/ui/**'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: [
              {
                name: 'react-native',
                importNames: ['Text', 'TouchableOpacity'],
                message: 'Use Text and Touchable from @/shared/ui.',
              },
            ],
            patterns: [
              {
                group: ['@/shared/components', '@/shared/components/*'],
                message: 'shared/components was replaced by @/shared/ui.',
              },
            ],
          },
        ],
      },
    },
    {
      // Colors come from theme.colors; hex literals belong in shared/theme only
      files: ['src/**/*.ts', 'src/**/*.tsx'],
      excludedFiles: ['src/shared/theme/**'],
      rules: {
        'no-restricted-syntax': [
          'warn',
          {
            selector:
              'Literal[value=/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/]',
            message: 'Use a color from theme.colors instead of a hex literal.',
          },
        ],
      },
    },
  ],
};
