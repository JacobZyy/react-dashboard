import React, { type CSSProperties, useEffect, useRef, useState } from 'react'
import './index.scss'
import { getRotateValue } from '../utils/getRotateValue'
import { getDashboardWheelColor } from '../utils/getDashboardColor'
import { getCurrentPercentColor } from '../utils/getCurrentPercentColor'

interface DashboardProps {
  percent: number
  dashboardWheelColors?: Record<string, string>
  gradientUnit?: 'deg' | 'percent'
  title?: string
  backgroundColor?: string
  wheelWidth?: number
}

const defaultDashBoardColors = {
  0: '#8FFF00',
  33: '#11cf00',
  59: '#FFD80E',
  137: '#FF7A00',
  270: '#FE3B36',
}

const updateStep = 0.5

const DashBoard: React.FC<DashboardProps> = ({ wheelWidth = 8, backgroundColor = '#fff', title = 'title', percent: targetPercent, dashboardWheelColors = defaultDashBoardColors, gradientUnit = 'deg' }) => {
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

  const rotateValue = getRotateValue(percent)

  const { colorConfig, ...dashboardWheelStyle } = getDashboardWheelColor(dashboardWheelColors, gradientUnit)

  const currentPercentColor = getCurrentPercentColor(percent, colorConfig)

  const dashboardArrowStyle: CSSProperties = {
    transform: `rotate(${rotateValue}deg)`,
  }
  const wheelShadowThreshold = rotateValue + 45
  const wheelShadowStyle: CSSProperties = {
    background: `conic-gradient(from -90deg at 50% 50%, transparent 0deg, transparent ${wheelShadowThreshold}deg, #fff ${wheelShadowThreshold}deg, #fff 270deg, transparent 270deg, transparent 360deg)`,
  }
  const maskStyle: CSSProperties = {
    width: `calc(100% - ${wheelWidth * 2}px)`,
    height: `calc(100% - ${wheelWidth * 2}px)`,
    // display: 'none',
    background: `conic-gradient(from 270deg at 50% 50%, transparent 0deg, ${currentPercentColor}20 0deg, ${currentPercentColor}20 270deg, transparent 270deg)`,

  }

  return (
    <div className="dashboard">
      <div className="dashboard-color-wheel" style={dashboardWheelStyle}>
        <div className="dashboard-color-wheel--shadow" style={wheelShadowStyle}></div>
      </div>
      <div className="dashboard-color-mask" style={maskStyle} />
      <div className="dashboard-data">
        {/* <div className="dashboard-data-arrow" style={dashboardArrowStyle}>
          <svg className="dashboard-data-arrow--icon" width="23" height="36" viewBox="0 0 23 36" fill="none">
            <path d="M9.11918 23.1727C10.32 21.6064 12.68 21.6064 13.8808 23.1727L23 35.0673L-2.004e-07 35.0673L9.11918 23.1727Z" fill={currentPercentColor} />
            <path d="M16.961 7.73608C16.961 10.7737 14.4986 13.2361 11.461 13.2361C8.42345 13.2361 5.96101 10.7737 5.96101 7.73608C5.96101 4.69852 8.42345 2.23608 11.461 2.23608C14.4986 2.23608 16.961 4.69852 16.961 7.73608Z" fill={backgroundColor} stroke={currentPercentColor} stroke-width="4" />
          </svg>
        </div> */}
        {/* <div className="dashboard-data-circle">
          <span className="dashboard-data-title">{title}</span>
          <span className="dashboard-data-percent">
            {Math.floor(percent)}
            %
          </span>
        </div> */}
      </div>
    </div>
  )
}

export default DashBoard
