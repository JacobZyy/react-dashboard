import { type BezierConfig, type ClipPathConfig, getRingPath, getSectorPath, type Position, type RingPathConfig } from './getClipPathValue'
import { getCurrentColor } from './getCurrentColor'

export const updateStep = 0.5
export const defaultDashBoardSize = 188
export const wheelWidthPercent = 0.05
export const defaultConicGradientColor = 'conic-gradient(from 90deg at 50% 50%, #8FFF00 0, #11CF00 48.5deg, #FFD80E 78.5deg, #FF7A00 157deg, #FE3B36 300deg)'

export {
  type BezierConfig,
  type ClipPathConfig,
  getCurrentColor,
  getRingPath,
  getSectorPath,
  type Position,
  type RingPathConfig,
}
