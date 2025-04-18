import baseConfig from '@repo/eslint-config/base'
import reactConfig from '@repo/eslint-config/react'

export default [
  {
    ignores: ['dist/**'],
  },
  ...baseConfig,
  ...reactConfig,
]
