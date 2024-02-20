import React, { type CSSProperties, useEffect, useRef, useState } from 'react'
import './index.scss'
import classNames from 'classnames'
import getCurrentPercentColor, { getColorWithOpacity } from '../utils/getCurrentPercentColor'
import type { DashBoardMaskProps } from './components/DashBoardMask'
import DashBoardMask from './components/DashBoardMask'
import type { DashBoardRingProps } from './components/DashBoardRing'
import DashBoardRing from './components/DashBoardRing'
import DashBoardSmallRing from './components/DashBoardSmallRing'
import DashBoardArrow from './components/DashBoardArrow'

interface DashboardProps {
  percent: number
  title?: string
  wheelCls?: string
  maskCls?: string
  dashBoardDataCls?: string
  dashBoardSize?: number
  wheelBackground?: string
  backgroundColor?: string
}

const updateStep = 0.5
const defaultDashBoardSize = 188

const defaultBackgroundColor = 'conic-gradient(from 90deg at 50% 50%, #8FFF00 45deg, #11CF00 77.5deg, #FFD80E 103.5deg, #FF7A00 182deg, #FE3B36 315deg)'

const DashBoard: React.FC<DashboardProps> = (props) => {
  const {
    backgroundColor = '#fff',
    title = 'title',
    percent: targetPercent,
    dashBoardSize = defaultDashBoardSize,
    wheelBackground = defaultBackgroundColor,
    wheelCls,
    maskCls,
    dashBoardDataCls,
  } = props
  const [percent, setPercent] = useState<number>(0)

  const latestPercent = useRef<number>(percent)
  latestPercent.current = percent

  const wheelWidth = dashBoardSize * 0.05

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

  const ringPathConfig = {
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
    className: maskCls,
    size: dashBoardSize - wheelWidth,
  }

  const dashBoardDataStyle: CSSProperties = {
    color: curColor,
  }

  return (
    <div className="dashboard" style={dashBoardStyle}>

      <DashBoardRing {...dashBoardRingConfig} />
      <DashBoardSmallRing smallRingSize={wheelWidth * 2} ringPathConfig={ringPathConfig} fillColor={curColor} backgroundColor={backgroundColor} />
      <DashBoardMask {...dashBoardMaskConfig} />

      <div className="dashboard-data">
        <DashBoardArrow fillColor={curColor} percent={percent} scaleSize={dashBoardSize / defaultDashBoardSize} />
        <div style={dashBoardDataStyle} className={classNames('dashboard-data-circle', dashBoardDataCls)}>
          <span className="dashboard-data-circle-title">{title}</span>
          <span className="dashboard-data-circle-percent">
            {Math.floor(percent)}
            <span className="dashboard-data-circle-percent--icon">%</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default DashBoard
