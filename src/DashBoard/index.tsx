import React, { type CSSProperties, useEffect, useRef, useState } from 'react'
import './index.scss'
import getCurrentPercentColor from '../utils/getCurrentPercentColor'
import type { DashBoardMaskProps } from './components/DashBoardMask'
import DashBoardMask from './components/DashBoardMask'
import type { DashBoardRingProps } from './components/DashBoardRing'
import DashBoardRing from './components/DashBoardRing'
import DashBoardSmallRing from './components/DashBoardSmallRing'
import DashBoardArrow from './components/DashBoardArrow'

interface DashboardProps {
  percent: number
  title?: string
  backgroundColor?: string
  wheelWidth?: number
  wheelCls?: string
  wheelBackground?: string
  dashBoardSize?: number
  maskCls?: string
}

const updateStep = 0.5

const defaultBackgroundColor = 'conic-gradient(from 90deg at 50% 50%, #8FFF00 45deg, #11CF00 77.5deg, #FFD80E 103.5deg, #FF7A00 182deg, #FE3B36 315deg)'

const DashBoard: React.FC<DashboardProps> = (props) => {
  const {
    backgroundColor = '#fff',
    title = 'title',
    percent: targetPercent,
    dashBoardSize = 188,
    wheelBackground = defaultBackgroundColor,
    wheelCls,
    wheelWidth = 8,
    maskCls,
  } = props
  const [percent, setPercent] = useState<number>(0)
  const latestPercent = useRef<number>(percent)
  latestPercent.current = percent

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
    fillColor: '#ffe8e8',
    className: maskCls,
    size: dashBoardSize - wheelWidth,
  }

  return (
    <div className="dashboard" style={dashBoardStyle}>

      <DashBoardRing {...dashBoardRingConfig} />
      <DashBoardSmallRing ringPathConfig={ringPathConfig} fillColor={curColor} backgroundColor={backgroundColor} />
      <DashBoardMask {...dashBoardMaskConfig} />

      <div className="dashboard-data">
        <DashBoardArrow fillColor={curColor} percent={percent} />
        <div className="dashboard-data-circle">
          <span className="dashboard-data-title">{title}</span>
          <span className="dashboard-data-percent">
            {Math.floor(percent)}
            %
          </span>
        </div>
      </div>
    </div>
  )
}

export default DashBoard
