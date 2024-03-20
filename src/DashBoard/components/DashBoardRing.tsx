import type { CSSProperties } from 'react'
import classNames from 'classnames'
import { type RingPathConfig, getRingPath } from '../../utils'

export type DashBoardRingProps = {
  pathConfig: RingPathConfig
} & Required<Pick< CSSProperties, 'background'>>

function DashBoardRing(props: DashBoardRingProps) {
  const { pathConfig, background } = props
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
      <div className={classNames('border-rd-50% rotate-135deg')} style={ringStyle} />
    </div>
  )
}

export default DashBoardRing
