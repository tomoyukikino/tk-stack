import { restrictEnvAccess } from '@repo/eslint-config/base'
import reactConfig from '@repo/eslint-config/react'

export default [
  ...reactConfig,
  ...restrictEnvAccess,
  {
    files: ['vite.config.ts'],
    rules: {
      'no-restricted-properties': 'off',
    },
  },
]
