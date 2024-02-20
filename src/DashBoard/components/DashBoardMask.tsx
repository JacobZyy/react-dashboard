import type { CSSProperties } from 'react'
import { getSectorPath } from '@/utils/getClipPathValue'

export interface DashBoardMaskProps {
  fillColor: string
  className?: string
  size: number
}

function DashBoardMask({ fillColor, className, size }: DashBoardMaskProps) {
  const maskPathVal = getSectorPath({ radio: 90, angle: 270 })
  const maskStyle: CSSProperties = {
    background: fillColor,
    clipPath: `path("${maskPathVal}")`,
    transform: 'rotate(135deg)',
    width: size,
    height: size,
  }
  return (
    <div className="dashboard-color-mask">
      <div className={className} style={maskStyle} />
    </div>
  )
}

export default DashBoardMask
