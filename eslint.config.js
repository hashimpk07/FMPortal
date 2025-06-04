import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import airbnbBaseImports from 'eslint-config-airbnb-base/rules/imports';
import airbnbBaseBestPractices from 'eslint-config-airbnb-base/rules/best-practices';

export default [
    {
        files: ['**/*.{ts,tsx}'],
        ignores: ['dist', 'node_modules'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parser: tsParser,
            sourceType: 'module',
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            react: react,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            'jsx-a11y': jsxA11y,
            import: importPlugin,
            prettier: prettier,
        },
        settings: {
            'import/parsers': {
                '@typescript-eslint/parser': ['.ts', '.tsx'],
            },
            'import/resolver': {
                node: {
                    extensions: ['.js', '.jsx', '.ts', '.tsx'],
                    paths: ['src'],
                },
                typescript: {
                    alwaysTryTypes: true,
                },
            },
        },
        rules: {
            ...airbnbBaseImports.rules,
            ...airbnbBaseBestPractices.rules,

            indent: 'off',
            quotes: 'off',
            'import/named': 'off',

            'prettier/prettier': [
                'warn',
                {
                    singleQuote: true,
                    tabWidth: 4,
                    printWidth: 100,
                    semi: true,
                    endOfLine: 'auto',
                },
            ],

            ...tsPlugin.configs.recommended.rules,
            ...jsxA11y.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,

            'react/react-in-jsx-scope': 'off',
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

            'import/extensions': 'off',
            'import/no-named-as-default': 'off',
            'import/no-named-as-default-member': 'off',
            'import/prefer-default-export': 'off',
            'no-return-await': 'off',

            '@typescript-eslint/no-explicit-any': 'off',
            'consistent-return': 'off',
            'no-console': 'warn',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        },
    },
    prettierConfig,
];
