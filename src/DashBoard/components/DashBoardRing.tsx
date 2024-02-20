import type { CSSProperties } from 'react'
import { type RingPathConfig, getRingPath } from '@/utils/getClipPathValue'

export type DashBoardRingProps = {
  pathConfig: RingPathConfig
  className?: string
} & Required<Pick< CSSProperties, 'background'>>

function DashBoardRing(props: DashBoardRingProps) {
  const { pathConfig, background, className } = props
  const ringPathValue = getRingPath(pathConfig)
  const { outerRadio } = pathConfig
  const size = outerRadio * 2
  const ringStyle: CSSProperties = {
    width: size,
    height: size,
    background,
    borderRadius: '50%',
    clipPath: `path('${ringPathValue}')`,
    transform: 'rotate(135deg)',
  }

  return (
    <div className="dashboard-color-wheel">
      <div className={className} style={ringStyle} />
    </div>
  )
}

export default DashBoardRing
