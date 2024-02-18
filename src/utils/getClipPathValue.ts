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

enum Quadrant {
  first,
  second,
  third,
  fourth,
}

type GetBezierConfigParams = Required<Omit<ClipPathConfig, 'radio' | 'centerPos' >>

function getFixedNumber(n: number) {
  return Math.round(n * 10000) / 10000
}

function sinAngle(angle: number) {
  return Math.sin(angle / 180 * Math.PI)
}

function cosAngle(angle: number) {
  return Math.cos(angle / 180 * Math.PI)
}

function getHValue(angle: number): number {
  return 4 / 3 * ((1 - cosAngle(angle / 2)) / sinAngle(angle / 2))
}

/**
 * 以单位圆计算bezier曲线的四个点
 * 以第一象限为基准，其余象限的均根据第一象限的点进行对称变换获得
 */
function getBaseBezierConfig(config: GetBezierConfigParams): BezierConfig {
  const { angle, startPos } = config
  const startAngle = Math.atan(startPos[1] / startPos[0]) / Math.PI * 180
  const endAngle = angle + startAngle

  const startHValue = startAngle === 0 ? getHValue(endAngle) : getHValue(startAngle)
  const endHValue = getHValue(endAngle)

  const pointD: Position = [(cosAngle(startAngle)), (sinAngle(startAngle))]
  const pointC: Position = [(cosAngle(startAngle) - startHValue * sinAngle(startAngle)), (sinAngle(startAngle) + startHValue * cosAngle(startAngle))]

  const pointA: Position = [(cosAngle(endAngle)), (sinAngle(endAngle))]
  const pointB: Position = [(cosAngle(endAngle) + endHValue * sinAngle(endAngle)), (sinAngle(endAngle) - endHValue * cosAngle(endAngle))]

  return {
    pointA,
    pointB,
    pointC,
    pointD,
  }
}

function getStartPositionList(startPos: Position): [quadrant: Quadrant, array: Position[]] {
  const [x, y] = startPos
  if (x >= 0 && y >= 0)
    return [Quadrant.first, [startPos, [0, 1], [-1, 0], [0, -1]]]
  if (x < 0 && y >= 0)
    return [Quadrant.second, [startPos, [-1, 0], [0, -1]]]
  if (x < 0 && y < 0)
    return [Quadrant.third, [startPos, [0, -1]]]
  return [Quadrant.fourth, [startPos]]
}

function getOffsetPointPosition(point: Position, centerPos: Position, radio: number): Position {
  return [getFixedNumber(point[0] * radio + centerPos[0]), getFixedNumber(point[1] * radio + centerPos[1])]
}

function getClipPathValueFromBezierConfig(bezierConfig: BezierConfig[], clipPathConfig: ClipPathConfig) {
  const { radio, angle, centerPos = [radio, radio], startPos = [2 * radio, radio] } = clipPathConfig
  const CValue = bezierConfig.map(({ pointA, pointB, pointC }) => {
    return `C${pointC.join(' ')} ${pointB.join(' ')} ${pointA.join(' ')}\n`
  }).join('')
  if (angle === 360)
    return `M${startPos.join(' ')}${CValue}Z`
  else
    return `M${centerPos.join(' ')}\nL${startPos.join(' ')}\n${CValue}Z`
}

function isLegalStartPosition(startPos: Position, centerPos: Position, radio: number) {
  const deltaX = startPos[0] - centerPos[0]
  const deltaY = startPos[1] - centerPos[1]
  return deltaX * deltaX + deltaY * deltaY - radio * radio < 1e-3
}

const PointRotateMap: Record<Quadrant, (p: Position) => Position> = {
  [Quadrant.first]: p => p,
  [Quadrant.second]: ([x, y]) => ([-y, x] as Position),
  [Quadrant.third]: ([x, y]) => ([-x, -y] as Position),
  [Quadrant.fourth]: ([x, y]) => ([y, -x] as Position),
}

function getQuadrantBezierConfig(config: GetBezierConfigParams, quadrant: Quadrant) {
  const rotatePoint = PointRotateMap[quadrant]
  const { startPos, ...restConfig } = config
  const fixedStartPos: Position = rotatePoint(startPos)
  const { pointA, pointB, pointC, pointD } = getBaseBezierConfig({ startPos: fixedStartPos, ...restConfig })

  return {
    pointA: rotatePoint(pointA),
    pointB: rotatePoint(pointB),
    pointC: rotatePoint(pointC),
    pointD: rotatePoint(pointD),
  }
}

function getFullBezierPoints(config: ClipPathConfig) {
  const { radio, angle, centerPos = [radio, radio], startPos = [2 * radio, radio] } = config
  if (!isLegalStartPosition(startPos, centerPos, radio))
    throw new Error('invalid start position, start position should be on the circle path')

  // 先转成圆心为0,0的单位圆。最后算值的时候再统一乘radio以及圆心偏移量
  // 单位圆的开始点
  const unitStartPos: Position = [(startPos[0] - centerPos[0]) / radio, (startPos[1] - centerPos[1]) / radio]

  const [startQuadrant, startPositionArrays] = getStartPositionList(unitStartPos)
  let currentAngle = angle % 360 || 360

  const bezierConfigs: BezierConfig[] = []
  let currentQuadrant = startQuadrant

  while (currentAngle > 0) {
    const angle = currentAngle > 90 ? 90 : currentAngle
    bezierConfigs.push(getQuadrantBezierConfig({ angle, startPos: startPositionArrays[currentQuadrant] }, currentQuadrant))
    currentAngle -= 90
    currentQuadrant += 1
  }
  const bezierOffsetConfig: BezierConfig[] = bezierConfigs.map((config) => {
    const { pointA, pointB, pointC, pointD } = config
    return {
      pointA: getOffsetPointPosition(pointA, centerPos, radio),
      pointB: getOffsetPointPosition(pointB, centerPos, radio),
      pointC: getOffsetPointPosition(pointC, centerPos, radio),
      pointD: getOffsetPointPosition(pointD, centerPos, radio),
    }
  })
  return bezierOffsetConfig
}

export interface RingPathConfig {
  outerRadio: number
  innerRadio: number
  centerPos?: Position
  startPos?: Position
  angle: number
}

export function getSectorPath(config: ClipPathConfig) {
  const bezierConfigs = getFullBezierPoints(config)
  return getClipPathValueFromBezierConfig(bezierConfigs, config)
}

export function getRingPath(config: RingPathConfig) {
  const { outerRadio, innerRadio, ...commonConfig } = config
  const innerCenterPos: Position = [outerRadio, outerRadio]
  const innerStartPos: Position = [outerRadio + innerRadio, outerRadio]
  const outerConfig = { ...commonConfig, radio: outerRadio }
  const innerConfig = { ...commonConfig, radio: innerRadio, centerPos: innerCenterPos, startPos: innerStartPos }
  const outerPoints = getFullBezierPoints(outerConfig)
  const innerPoints = getFullBezierPoints(innerConfig)
  const { angle, startPos: outerStartPos = [outerRadio * 2, outerRadio] } = commonConfig
  const outerEndPos = getOffsetPointPosition([cosAngle(angle), sinAngle(angle)], [outerRadio, outerRadio], outerRadio)
  // const innerEndPos = getOffsetPointPosition([cosAngle(angle), sinAngle(angle)], innerCenterPos, innerRadio)
  if (angle === 360) {
    const outerPath = getClipPathValueFromBezierConfig(outerPoints, outerConfig)
    const innerPath = getClipPathValueFromBezierConfig(innerPoints, innerConfig)
    return `${outerPath}${innerPath}`
  }
  const innerCValue = innerPoints.map(({ pointA, pointB, pointC }) => {
    return `C${pointC.join(' ')} ${pointB.join(' ')} ${pointA.join(' ')}\n`
  }).join('')
  const outerCValue = outerPoints.reverse().map(({ pointB, pointC, pointD }) => {
    return `C${pointB.join(' ')} ${pointC.join(' ')} ${pointD.join(' ')}\n`
  }).join('')
  return `M${outerStartPos.join(' ')}\nL${innerStartPos.join(' ')}\n${innerCValue}L${outerEndPos.join(' ')}\n${outerCValue}\nZ`
}
