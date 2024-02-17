import type { CSSProperties } from 'react'

export function getDashboardWheelColor(colorConfig: Record<string, string>, colorUnit: 'deg' | 'percent'): Pick<CSSProperties, 'background'> & { colorConfig: Record<string, string> } {
  let colorText = ''
  let formattedColor = {
    ...colorConfig,
  }
  if (colorUnit === 'deg') {
    const valueArray: [key: number, value: string][] = Object.entries(colorConfig).map(([key, value]) => {
      return [Number(key), value]
    })
    valueArray.sort((prev, cur) => prev[0] - cur[0])
    if (valueArray[0][0] > 0) {
      const firstColor = valueArray[0][1]
      valueArray.unshift([0, firstColor])
      formattedColor = {
        0: firstColor,
        ...formattedColor,
      }
    }
    if (valueArray[valueArray.length - 1][0] < 315) {
      const lastColor = valueArray[valueArray.length - 1][1]
      valueArray.push([315, lastColor])
      formattedColor = {
        ...formattedColor,
        315: lastColor,
      }
    }
    const colorUnion = Object.entries(colorConfig).reduce((prev, [deg, value]) => {
      return `${prev}, ${value} ${Number(deg) + 45}deg`
    }, '')
    colorText = `conic-gradient(from 225deg at 50% 50%, transparent 0deg, transparent 45deg ${colorUnion}, transparent 315deg, transparent 360deg)`
  }

  return {
    background: colorText,
    colorConfig: formattedColor,
  }
}
