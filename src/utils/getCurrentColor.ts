import chroma from 'chroma-js'

function extractColor(color: string): [color: string, stopVal: number][] {
  const colorReg = /conic-gradient\(from \d+deg at \d+% \d+%,\s*(.+)\)/
  const colorConfig = color.match(colorReg)
  if (!colorConfig)
    throw new TypeError('invalid color config')

  const [_, colorConfigStr] = colorConfig

  const colorGroupsReg = /(?:#(?:[\da-f]{4}){1,2}|[\w]+\(.*?\)|[\w]+)\s+([\d.]+(?:%|deg)?)/gi
  const colorGroups = colorConfigStr.match(colorGroupsReg)
  if (!colorGroups)
    throw new Error('no match valid color')

  const colorList = colorGroups.map<[string, number]>((colorUnion) => {
    const m = /^(.+)\s+([\d.]+(?:%|deg)?)$/
    const [_, curColor, degreeVal] = colorUnion.match(m) || []
    const [degreeStr] = degreeVal.match(/\d*\.?\d*/) || ['0']
    let stopVal = Number(degreeStr)
    if (degreeVal.includes('deg'))
      stopVal /= 360
    if (degreeVal.includes('%'))
      stopVal /= 100

    return [curColor, Math.floor(stopVal * 1000) / 1000]
  })
  const [firstColor, firstStop] = colorList[0]
  const [lastColor, lastStop] = colorList[colorList.length - 1]
  if (firstStop)
    colorList.unshift([firstColor, 0])

  if (lastStop < 1)
    colorList.push([lastColor, 1])

  return colorList
}

export function getCurrentColor(color: string) {
  const colorConfig = extractColor(color)

  return chroma.scale([...colorConfig.map(([color]) => `#${color}`)]).domain([...colorConfig.map(([_, val]) => val)])
}
