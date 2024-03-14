// uno.config.ts
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
    [/^radial-gradient-(.*)$/, ([, c], { rawSelector }) => {
      const selector = toEscapedSelector(rawSelector)
      return `
      ${selector} {
        background: radial-gradient(${c});
      }
      `
    }],
  ],

})
