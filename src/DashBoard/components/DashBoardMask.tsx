import { getSectorPath } from '@/utils/getClipPathValue'

interface DashBoardMaskProps {
  fillColor: string
}

function DashBoardMask({ fillColor }: DashBoardMaskProps) {
  return (
    <svg width={180} height={180} viewBox="0 0 180 180">
      <path d={getSectorPath({ radio: 90, angle: 270 })} fill={fillColor} />
    </svg>
  )
}

export default DashBoardMask
