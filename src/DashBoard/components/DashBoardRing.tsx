import type { CSSProperties } from 'react'
import classNames from 'classnames'
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
    clipPath: `path('${ringPathValue}')`,
  }

  return (
    <div className="color-wheel absolute z-9 flex items-center justify-center">
      <div className={classNames(className, 'border-rd-50% rotate-135deg')} style={ringStyle} />
    </div>
  )
}

export default DashBoardRing
