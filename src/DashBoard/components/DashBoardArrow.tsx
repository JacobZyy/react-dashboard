import type { CSSProperties } from 'react'

interface DashBoardArrowProps {
  fillColor: string
  percent: number
}

function DashBoardArrow({ fillColor, percent }: DashBoardArrowProps) {
  const dashBardArrowStyle: CSSProperties = {
    transform: `rotate(${Math.round(percent / 100 * 270 - 45)}deg)`,
  }
  return (
    <div className="dashboard-data-arrow" style={dashBardArrowStyle}>
      <svg className="dashboard-data-arrow--icon" width="24" height="14" viewBox="0 0 24 14" fill={fillColor}>
        <path d="M9.674 1.459C10.875 -0.107 13.2352 -0.107 14.436 1.46L23.56 13.35L0.56 13.35L9.67 1.46Z" />
      </svg>
    </div>
  )
}

export default DashBoardArrow
