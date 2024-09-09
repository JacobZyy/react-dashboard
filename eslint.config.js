import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  unocss: true,
  react: true,
  typescript: true,
  regexp: false,
}).append({
  rules: {
    'no-console': 'warn',
  },
})
