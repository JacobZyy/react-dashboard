import {
  defineConfig,
  presetIcons,
  presetMini,
  presetTypography,
  presetUno,
  toEscapedSelector,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons(),
    presetMini(),
    presetTypography(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  rules: [
    [/^letter-spacing-(.+)$/, ([, c], { rawSelector }) => {
      const selector = toEscapedSelector(rawSelector)
      return `${selector} {
        --letter-spacing: ${c};
        letter-spacing: var(--letter-spacing);
      }`
    }],
  ],

})
