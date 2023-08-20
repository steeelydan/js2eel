module.exports = {
    env: {
        es2021: true
    },
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    overrides: [],
    ignorePatterns: ['/*', '!/src'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: '2021',
        sourceType: 'module'
    },
    plugins: ['@typescript-eslint'],
    rules: {
        'no-warning-comments': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/ban-ts-comment': 1,
        '@typescript-eslint/no-unused-vars': [
            'warn',
            {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_'
            }
        ]
    }
};
