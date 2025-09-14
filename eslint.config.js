import eslint from '@eslint/js';
import pluginSecurity from 'eslint-plugin-security';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  pluginSecurity.configs.recommended,
  eslintPluginUnicorn.configs.recommended,
  ...tseslint.configs.recommended,
  { ignores: ['**/*.js', '**/*.cjs', '**/*.mjs'] },
  {
    rules: {
      'unicorn/prevent-abbreviations': 'off',
    },
  }
);
