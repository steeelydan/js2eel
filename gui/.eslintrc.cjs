module.exports = {
    env: {
        es2021: true,
        browser: true
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended'
    ],
    overrides: [],
    ignorePatterns: ['/*', '!/src', '!/webapp', '!/desktop'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: '2022',
        sourceType: 'module'
    },
    plugins: ['@typescript-eslint'],
    rules: {
        'no-warning-comments': 'warn',
        '@typescript-eslint/no-explicit-any': ['warn'],
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/ban-ts-comment': 1,
        '@typescript-eslint/no-unused-vars': [
            'warn',
            {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_'
            }
        ],
        'react/react-in-jsx-scope': 'off',
        'react-hooks/exhaustive-deps': 'error'
    }
};
