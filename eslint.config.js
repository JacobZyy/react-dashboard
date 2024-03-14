import antfu, { unocss } from '@antfu/eslint-config'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat()

export default antfu(
  {
    typescript: true,
  },
  ...compat.config({
    rules: {
      'no-console': 'warn',
    },
  }),
  unocss(),
)
