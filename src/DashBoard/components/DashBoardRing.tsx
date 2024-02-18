import { type RingPathConfig, getRingPath } from '@/utils/getClipPathValue'

interface DashBoardRingProps {
  pathConfig: RingPathConfig
}

function DashBoardRing(props: DashBoardRingProps) {
  const { pathConfig } = props
  const ringPathValue = getRingPath(pathConfig)
  const { outerRadio } = pathConfig
  const size = outerRadio * 2
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d={ringPathValue}
        fill="red"
      />

    </svg>
  )
}

export default DashBoardRing
