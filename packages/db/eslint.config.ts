import baseConfig, { restrictEnvAccess } from '@repo/eslint-config/base'

export default [
  {
    ignores: ['dist/**'],
  },
  ...baseConfig,
  ...restrictEnvAccess,
  {
    files: ['drizzle.config.ts'],
    rules: {
      'no-restricted-properties': 'off',
    },
  },
]
