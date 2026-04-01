import type { OxlintConfig } from 'oxlint';

export default {
  plugins: ['typescript'],

  ignorePatterns: ['dist', 'coverage', 'src/generated'],

  rules: {
    'typescript/no-explicit-any': 'off',
    'no-unused-vars': [
      'error',
      {
        args: 'all',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
  },
} satisfies OxlintConfig;
