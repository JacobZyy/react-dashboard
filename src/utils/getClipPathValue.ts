export type Position = [x: number, y: number]

export interface ClipPathConfig {
  /** 拟合圆弧的半径 */
  radio: number
  /** 需要拟合的角度 */
  angle: number
  /**
   * @description 圆心坐标
   * @default {Position} [x: radio, y: radio]
   */
  centerPos?: Position
  /**
   * @description 画线开始点坐标
   * @default {Position} [x: 2 * radio, y: radio]
   */
  startPos?: Position
}

export interface BezierConfig {
  pointA: Position
  pointB: Position
  pointC: Position
  pointD: Position
}

function getHValue(angle: number): number {
  const { sin, cos } = Math
  return 4 / 3 * ((1 - cos(angle / 2)) / sin(angle / 2))
}

/**
 * 以单位圆计算bezier曲线的四个点
 */
function getBezierConfig(config: Required<Omit<ClipPathConfig, 'radio' | 'centerPos' >>): BezierConfig {
  const { sin, cos, atan } = Math
  const { angle, startPos } = config
  const startAngle = atan(startPos[1] / startPos[0])
  const startHValue = getHValue(startAngle)
  const pointD: Position = [cos(startAngle), sin(startAngle)]
  const pointC: Position = [cos(startAngle) - startHValue * sin(startAngle), sin(startAngle) + startHValue * cos(startAngle)]
  const endAngle = angle + startAngle
  const endHValue = getHValue(endAngle)
  const pointA: Position = [cos(endAngle), sin(endAngle)]
  const pointB: Position = [cos(endAngle) + endHValue * sin(endAngle), sin(endAngle) - endHValue * cos(startAngle)]

  return {
    pointA,
    pointB,
    pointC,
    pointD,
  }
}

function getStartPositionList(startPos: Position): Position[] {
  const [x, y] = startPos
  if (x >= 0 && y >= 0)
    return [startPos, [0, 1], [-1, 0], [0, -1]]
  if (x < 0 && y >= 0)
    return [startPos, [-1, 0], [0, -1]]
  if (x < 0 && y < 0)
    return [startPos, [0, -1]]
  return [startPos]
}

export function getClipPathValue(config: ClipPathConfig) {
  const { radio, angle, centerPos = [radio, radio], startPos = [2 * radio, radio] } = config
  // 转化成弧度值
  const angleValue = angle / 180 * Math.PI
  // 先转成圆心为0,0的单位圆。最后算值的时候再统一乘radio以及圆心偏移量
  // 单位圆的开始点
  const unitStartPos: Position = [(startPos[0] - centerPos[0]) / radio, (startPos[1] - centerPos[1]) / radio]

  const startPositionArrays = getStartPositionList(unitStartPos)

  let currentAngle = angleValue % (2 * Math.PI)
  const bezierConfigs: BezierConfig[] = []
  let quarterCount = 0
  while (currentAngle > 90) {
    currentAngle -= 90
    bezierConfigs.push(getBezierConfig({ angle: (Math.PI / 2), startPos: startPositionArrays[quarterCount] }))
    quarterCount += 1
  }
  bezierConfigs.push(getBezierConfig({ angle: currentAngle, startPos: startPositionArrays[quarterCount] }))
}
