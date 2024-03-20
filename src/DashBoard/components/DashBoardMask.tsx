import type { CSSProperties } from 'react'
import { getSectorPath } from '../../utils'

export interface DashBoardMaskProps {
  fillColor: string
  size: number
}

function DashBoardMask({ fillColor, size }: DashBoardMaskProps) {
  const maskPathVal = getSectorPath({ radio: Math.round(size / 2), angle: 270 })
  const maskCommonStyle: CSSProperties = {
    width: size,
    height: size,
    clipPath: `path("${maskPathVal}")`,
  }
  const maskStyle: CSSProperties = {
    background: fillColor,
  }
  return (
    <div className="mask absolute left-50% top-50% z-8 translate--50%">
      <div className="rotate-135deg bg-#fff" style={maskCommonStyle}>
        <div className="h-full w-full" style={maskStyle} />
      </div>
    </div>
  )
}

export default DashBoardMask
