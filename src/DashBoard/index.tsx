import React, { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react'
import classNames from 'classnames'
import chroma from 'chroma-js'

import { type RingPathConfig, defaultConicGradientColor, defaultDashBoardSize, getCurrentColor, updateStep, wheelWidthPercent } from '../utils'
import { DashBoardArrow, DashBoardMask, type DashBoardMaskProps, DashBoardRing, type DashBoardRingProps } from './components'
import 'virtual:uno.css'

export interface DashBoardProps {
  /** the percent of this dashboard */
  percent: number
  /** dashboard title */
  title?: string
  /** dashboard data className for customized its style */
  dashBoardDataCls?: string
  /**
   *  @description the size of dashboard
   *  @default 188px
   */
  dashBoardSize?: number
  /**
   *  the bg of your container of dashboard
   *  for fill the color in the small ring to make it feel like bg-transparent
   */
  bgColor?: string

  /** gradient color */
  conicGradientColor?: string
}

const DashBoard: React.FC<DashBoardProps> = (props) => {
  const {
    bgColor,
    title = 'title',
    percent: targetPercent,
    dashBoardSize = defaultDashBoardSize,
    conicGradientColor = defaultConicGradientColor,
    dashBoardDataCls,
  } = props
  const [percent, setPercent] = useState<number>(0)

  const { deltaColors, colorStyle } = useMemo(() => {
    const chromaScalce = getCurrentColor(conicGradientColor)
    const deltaColors = chromaScalce.colors(100)
    deltaColors[0] = '#101114'
    const colorStyle = `conic-gradient(from 90deg at 50% 50%,${chromaScalce.colors(10).join(', ')})`
    return {
      deltaColors,
      colorStyle,
    }
  }, [conicGradientColor])

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

  /** 从270色盘上的百分比转换成360色盘上的百分比 */
  const curColor = deltaColors[Math.round(percent * 270 / 360)]

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
    background: colorStyle,
  }

  const dashBoardMaskConfig: DashBoardMaskProps = {
    fillColor: chroma(curColor).alpha(0.08).toString(),
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
        <DashBoardArrow dashBoardSize={dashBoardSize} smallRingBackground={bgColor} fillColor={curColor} percent={percent} />
        <div style={dashBoardDataStyle} className={classNames('flex w-full h-full border-rd-50% border-white shadow-[0_20px_30px_0] shadow-#00000026 box-border flex-col justify-center items-center relative z-11 font-size-14px line-height-20px fw-700', dashBoardDataCls)}>
          <span className="data-title">{title}</span>
          <span className="data-percent skew-x--6deg font-size-40px fw-800 line-height-48px letter-spacing--0.25px">
            {(Math.floor(percent)) || '--'}
            {!!percent && <span className="skew-x-6deg font-size-28px line-height-26px">%</span>}
          </span>
        </div>
      </div>
    </div>
  )
}

export default DashBoard
