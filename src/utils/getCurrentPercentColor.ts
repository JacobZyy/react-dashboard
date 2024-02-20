type RGBColorType = [
  R: number,
  G: number,
  B: number,
  A: number,
]
type ColorListItemType = [color: RGBColorType, percent: number]

function simpleColorToFull(str: string) {
  if (str.length > 4)
    return str
  return str.split('').map(c => `${c}${c}`).join('')
}

function getRGBAValue(rgb: string): RGBColorType {
  const isPercentAlpha = rgb.includes('%')
  const matches = rgb.match(/\d+/g)
  if (!matches)
    throw new TypeError('invalid rgb value')
  const [r, g, b, a = 100] = matches.map(v => Number(v))
  const alpha = isPercentAlpha ? a : a * 100
  return [r, g, b, alpha]
}

function hexToRgb(color: string): RGBColorType {
  if (color.includes('rgb'))
    return getRGBAValue(color)
  const hexMatch = color.toLowerCase().match(/([0-9a-f]{3}){1,2}\b/g)
  if (!hexMatch)
    throw new TypeError('invalid color value')
  // expand the short hex to the full hex
  const hexValue = simpleColorToFull(hexMatch[0])

  const resultValue = []
  for (let i = 0; i < hexValue.length; i += 2) {
    const unitHex = hexValue.slice(i, i + 2)
    resultValue.push(Number.parseInt(unitHex, 16))
  }
  // push the alpha value to the tuple
  if (resultValue.length === 3)
    resultValue.push(100)

  return resultValue as RGBColorType
}

function angleValueToPercent(angle: string): number {
  const angleMatch = angle.match(/\d+/)
  if (!angleMatch)
    throw new TypeError('invalid angle value')
  const angleValue = Number(angleMatch[0])
  if (angle.includes('%'))
    return angleValue
  return Math.round((angleValue / 360 * 10000)) / 100
}

function getPercentStartEndColor(percent: number, colorList: ColorListItemType[]): [left: ColorListItemType, right: ColorListItemType] {
  let left = 0
  let right = colorList.length - 1

  while (left <= right) {
    const mid = (left + right) >> 1
    if (colorList[mid][1] === percent)
      return [colorList[mid], colorList[mid]]
    if (colorList[mid][1] > percent)
      right = mid - 1
    else
      left = mid + 1
  }

  const fixedLeft = left - 1 < 0 ? colorList.length + left - 1 : left - 1
  const fixedRight = left >= colorList.length ? left - colorList.length : left
  const [startColor, originStartPercent] = colorList[fixedLeft]
  const startPercent = left - 1 < 0 ? 0 : originStartPercent

  const [endColor, originEndPercent] = colorList[fixedRight]
  const endPercent = left >= colorList.length ? 100 : originEndPercent
  return [[startColor, startPercent], [endColor, endPercent]]
}

function getColorByPercent(percent: number, startColor: RGBColorType, endColor: RGBColorType): RGBColorType {
  const finalColor: RGBColorType = [0, 0, 0, 100]
  return finalColor.map((_, idx) => {
    return percent / 100 * (endColor[idx] - startColor[idx]) + startColor[idx]
  }) as RGBColorType
}

function getCurrentPercentColor(originPercent: number, backgroundColor: string) {
  if (!originPercent)
    return '#101114'

  const colorAnglePattern = /(?:#(?:[a-fA-F0-9]{3}){1,2}|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*\d+(%)?\s*\)) \d+(\.\d+)?[deg|%]/g

  const colorAngleMatches = backgroundColor.match(colorAnglePattern)
  if (!colorAngleMatches)
    return '#101114'

  const updatedColorList = colorAngleMatches.map<ColorListItemType>((colorText) => {
    const colorTextList = colorText.split(' ')
    const [angleValue] = colorTextList.slice(-1)
    const colorValue = colorTextList.slice(0, -1).join(' ')

    return [hexToRgb(colorValue), angleValueToPercent(angleValue)]
  })

  if (updatedColorList[0][1] > 0) {
    const item: ColorListItemType = [updatedColorList[0][0], 0]
    updatedColorList.unshift(item)
  }
  if (updatedColorList[updatedColorList.length - 1][1] < 100) {
    const item: ColorListItemType = [updatedColorList[updatedColorList.length - 1][0], 100]
    updatedColorList.push(item)
  }

  const percent = originPercent * 270 / 360

  const [start, end] = getPercentStartEndColor(percent, updatedColorList)
  const [startColor, startPercent] = start
  const [endColor, endPercent] = end

  const percentInRange = Math.round((percent - startPercent) / (endPercent - startPercent) * 10000) / 100

  const [r, g, b, a] = getColorByPercent(percentInRange, startColor, endColor)
  return `rgba(${r}, ${g}, ${b}, ${a / 100})`
}

export default getCurrentPercentColor

const defaultBackgroundColor = 'conic-gradient(from 90deg at 50% 50%, #8FFF00 45deg, #11CF00 77.5deg, #FFD80E 103.5deg, #FF7A00 182deg, #589 315.5deg, rgba(0, 0, 0, 100%) 335.5deg)'

getCurrentPercentColor(30, defaultBackgroundColor)
