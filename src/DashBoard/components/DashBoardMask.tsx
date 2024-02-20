import type { CSSProperties } from 'react'
import { getSectorPath } from '@/utils/getClipPathValue'

export interface DashBoardMaskProps {
  fillColor: string
  className?: string
  size: number
}

function DashBoardMask({ fillColor, className, size }: DashBoardMaskProps) {
  const maskPathVal = getSectorPath({ radio: Math.round(size / 2), angle: 270 })
  const maskCommonStyle: CSSProperties = {
    width: size,
    height: size,
    clipPath: `path("${maskPathVal}")`,
  }
  const maskStyle: CSSProperties = {
    background: fillColor,
    ...maskCommonStyle,
  }
  return (
    <div className="dashboard-color-mask">
      <div className="dashboard-color-mask--bkg" style={maskCommonStyle}>
        <div className={className} style={maskStyle} />
      </div>
    </div>
  )
}

export default DashBoardMask
