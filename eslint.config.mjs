import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import playwright from 'eslint-plugin-playwright'

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.ts'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
            'no-console': 'warn',
        },
    },
    {
        files: ['tests/**/*.spec.ts', 'tests/**/*.test.ts'],
        ...playwright.configs['flat/recommended'],
        rules: {
            ...playwright.configs['flat/recommended'].rules,
            'playwright/expect-expect': 'off',
            'playwright/no-conditional-in-test': 'warn',
            'playwright/no-skipped-test': 'warn',
            'playwright/no-useless-await': 'error',
            'playwright/valid-expect': 'error',
            'playwright/prefer-to-have-length': 'warn',
            'playwright/no-wait-for-timeout': 'warn',
        },
    },
    {
        ignores: [
            'node_modules/**',
            'playwright-report/**',
            'test-results/**',
            '*.config.js',
        ],
    }
)
