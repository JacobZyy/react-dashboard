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
    // [/^border-(.*)$/, ([, c], { rawSelector }) => {
    //   const selector = toEscapedSelector(rawSelector)
    //   return `
    //   ${selector} {
    //     background: radial-gradient(${c});
    //   }
    //   `
    // }],
    [/^letter-spacing-(.+)$/, ([, c], { rawSelector }) => {
      const selector = toEscapedSelector(rawSelector)
      return `${selector} {
        --letter-spacing: ${c};
        letter-spacing: var(--letter-spacing);
      }`
    }],
  ],

})
