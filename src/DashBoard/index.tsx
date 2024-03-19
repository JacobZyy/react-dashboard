import React, { type CSSProperties, useEffect, useRef, useState } from 'react'

import classNames from 'classnames'
import getCurrentPercentColor, { getColorWithOpacity } from '../utils/getCurrentPercentColor'
import type { DashBoardMaskProps } from './components/DashBoardMask'
import DashBoardArrow from './components/DashBoardArrow'
import type { DashBoardRingProps } from './components/DashBoardRing'
import DashBoardRing from './components/DashBoardRing'
import DashBoardMask from './components/DashBoardMask'
import type { RingPathConfig } from '@/utils/getClipPathValue'
import { defaultDashBoardSize, updateStep, wheelWidthPercent } from '@/utils/commonValues'

interface DashboardProps {
  percent: number
  title?: string
  wheelCls?: string
  dashBoardDataCls?: string
  dashBoardSize?: number
  wheelBackground?: string
  backgroundColor?: string
}

const defaultBackgroundColor = 'conic-gradient(from 90deg at 50% 50%, #8FFF00 45deg, #11CF00 77.5deg, #FFD80E 103.5deg, #FF7A00 182deg, #FE3B36 315deg)'
const DashBoard: React.FC<DashboardProps> = (props) => {
  const {
    backgroundColor,
    title = 'title',
    percent: targetPercent,
    dashBoardSize = defaultDashBoardSize,
    wheelBackground = defaultBackgroundColor,
    wheelCls,
    dashBoardDataCls,
  } = props
  const [percent, setPercent] = useState<number>(0)

  const latestPercent = useRef<number>(percent)
  latestPercent.current = percent

  const wheelWidth = dashBoardSize * wheelWidthPercent

  useEffect(() => {
    const fixedTargetPercent = Math.min(Math.max(0, targetPercent), 100)
    const handleUpdatePercent = () => {
      if (latestPercent.current + updateStep < fixedTargetPercent) {
        return requestAnimationFrame(() => {
          setPercent((prev) => {
            return prev + updateStep
          })
          handleUpdatePercent()
        })
      }
      if (latestPercent.current - updateStep > fixedTargetPercent) {
        return requestAnimationFrame(() => {
          setPercent((prev) => {
            return prev - updateStep
          })
          handleUpdatePercent()
        })
      }
    }
    handleUpdatePercent()
  }, [targetPercent])

  const curColor = getCurrentPercentColor(percent, wheelBackground)

  const dashBoardStyle: CSSProperties = {
    width: dashBoardSize,
    height: dashBoardSize,
  }

  const ringPathConfig: RingPathConfig = {
    innerRadio: Math.round(dashBoardSize / 2) - wheelWidth,
    outerRadio: Math.round(dashBoardSize / 2),
    angle: Math.round(percent * 270 / 100),
  }

  const dashBoardRingConfig: DashBoardRingProps = {
    pathConfig: ringPathConfig,
    background: wheelBackground,
    className: wheelCls,
  }

  const dashBoardMaskConfig: DashBoardMaskProps = {
    fillColor: getColorWithOpacity(curColor, 0.08),
    size: dashBoardSize - wheelWidth,
  }

  const dashBoardDataStyle: CSSProperties = {
    color: curColor,
    background: 'radial-gradient(50% 50% at 50% 50%, #FFF9F9 0%, #FFF9F9 92.21%, #F3F1F1 100%)',
  }

  return (
    <div className="dashboard relative flex items-center justify-center border-rounded-50%" style={dashBoardStyle}>
      <DashBoardRing {...dashBoardRingConfig} />
      <DashBoardMask {...dashBoardMaskConfig} />

      <div className="dashboard-data relative z-11 h-68% w-68%">
        <DashBoardArrow dashBoardSize={dashBoardSize} smallRingBackground={backgroundColor} fillColor={curColor} percent={percent} />
        <div style={dashBoardDataStyle} className={classNames('flex w-full h-full border-rd-50% border-white shadow-[0_20px_30px_0] shadow-#00000026 box-border flex-col justify-center items-center relative z-11 font-size-14px line-height-20px fw-700', dashBoardDataCls)}>
          <span className="data-title">{title}</span>
          <span className="data-percent letter-spacing--0.25px skew-x--10deg font-size-40px fw-800 line-height-48px">
            {(Math.floor(percent)) || '--'}
            {!!percent && <span className="font-size-28px line-height-26px">%</span>}
          </span>
        </div>
      </div>
    </div>
  )
}

export default DashBoard
