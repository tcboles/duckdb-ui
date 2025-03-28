const eslintConfigPrettier = require('eslint-config-prettier');
const unusedImports = require('eslint-plugin-unused-imports');

module.exports = [
  eslintConfigPrettier,
  {
    plugins: {
      'unused-imports': unusedImports
    },
    rules: {
      'require-atomic-updates': 0,
      'no-async-promise-executor': 0,
      'comma-dangle': ['error', 'never'],
      'no-unused-vars': 'off', // or '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
            'vars': 'all',
            'varsIgnorePattern': '^_',
            'args': 'after-used',
            'argsIgnorePattern': '^_'
        }
      ]
    }
  }
];
