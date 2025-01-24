import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import noSecrets from 'eslint-plugin-no-secrets';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import pluginPromise from 'eslint-plugin-promise';
import pluginSecurity from 'eslint-plugin-security';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['**/node_modules/*', '**/build/*', '**/dist/*'],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  pluginSecurity.configs.recommended,
  eslintPluginPrettierRecommended,
  pluginPromise.configs['flat/recommended'],
  {
    plugins: {
      'no-secrets': noSecrets,
      'unused-imports': unusedImports,
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        },
      ],
      ...importPlugin.configs.recommended.rules,
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          'newlines-between': 'always',
        },
      ],
    },
  },
);
