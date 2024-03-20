import type { CSSProperties } from 'react'
import { defaultDashBoardSize, wheelWidthPercent } from '../../utils'

export interface DashBoardArrowProps {
  fillColor: string
  percent: number
  dashBoardSize: number
  smallRingBackground?: string
}

function DashBoardArrow({ fillColor, percent, dashBoardSize, smallRingBackground }: DashBoardArrowProps) {
  const dashBardArrowStyle: CSSProperties = {
    transform: `rotate(${Math.round(percent / 100 * 270 - 45)}deg)`,
  }
  const scaleSize = dashBoardSize / defaultDashBoardSize

  const dashBoardScale = {
    transform: `translate(-70%, -50%) rotate(-90deg) scale(${scaleSize})`,
  }

  const smallRingLeftVal = -(100 - 68) / 2 * dashBoardSize / 100
  const wheelWidth = dashBoardSize * wheelWidthPercent
  const transformXVal = (16 - wheelWidth) / 2
  const smallRingStyle: CSSProperties = {
    borderColor: fillColor,
    background: smallRingBackground,
    left: smallRingLeftVal,
    transform: `translate(-${transformXVal}px, -50%) scale(${scaleSize})`,
  }

  return (
    <div className="absolute h-full w-full" style={dashBardArrowStyle}>
      <svg className="absolute left-0 top-50%" style={dashBoardScale} width="24" height="14" viewBox="0 0 24 14" fill={fillColor}>
        <path d="M9.674 1.459C10.875 -0.107 13.2352 -0.107 14.436 1.46L23.56 13.35L0.56 13.35L9.67 1.46Z" />
      </svg>
      <div style={smallRingStyle} className="position-absolute top-50% z-99 box-border h-16px w-16px border-5px border-rounded-50% border-solid bg-#fff" />
    </div>
  )
}

export default DashBoardArrow
