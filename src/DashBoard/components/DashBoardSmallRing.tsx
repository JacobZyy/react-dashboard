import type { CSSProperties } from 'react'
import type { RingPathConfig } from '@/utils/getClipPathValue'

interface DashBoardProps {
  ringPathConfig: RingPathConfig
  backgroundColor: string
  fillColor: string
  smallRingSize?: number
  ringWidth?: number
}

function DashBoardSmallRing(props: DashBoardProps) {
  const {
    ringPathConfig,
    backgroundColor,
    fillColor,
    smallRingSize = 16,
    ringWidth,
  } = props
  const getSmallRingPos = (pathConfig: RingPathConfig): Pick<CSSProperties, 'left' | 'top' | 'transform'> => {
    const { outerRadio, innerRadio, angle: originAngle } = pathConfig
    const angle = originAngle + 135
    const radio = Math.round((innerRadio + outerRadio) / 2)
    const leftOffset = Math.cos(angle * Math.PI / 180)
    const topOffset = Math.sin(angle * Math.PI / 180)
    return {
      left: `${outerRadio}px`,
      top: `${outerRadio}px`,
      transform: `translate(calc(${Math.round(leftOffset * radio)}px - 50%), calc(${Math.round(topOffset * radio)}px - 50%))`,
    }
  }

  const smallRingPos = getSmallRingPos(ringPathConfig)
  const calculatedRingWidth = ringWidth ?? smallRingSize * 0.3125

  const smallRingStyle: CSSProperties = {
    position: 'absolute',
    background: backgroundColor,
    border: `${calculatedRingWidth}px solid ${fillColor}`,
    boxSizing: 'border-box',
    width: smallRingSize,
    height: smallRingSize,
    borderRadius: '50%',
    transition: `0.3s ease-in-out background-color`,
    ...smallRingPos,
  }

  return (
    <div className="dashboard-color-ring">
      <div style={smallRingStyle} />
    </div>
  )
}

export default DashBoardSmallRing
