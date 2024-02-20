import { useState } from 'react'
import DashBoard from '..'
import './App.css'

function App() {
  const [state, setState] = useState(0)
  const handleUpdatePercent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percent = Number.parseInt(e.target.value ?? '0')
    setState(percent)
  }

  // const testBkg = 'conic-gradient(from 90deg at 50% 50%, #69C7BC 0deg, #69C7BC 44.93379235267639deg, #38A1DD 77.43765950202942deg, #B052D1 142.20000386238098deg, #F12F75 182.07465648651123deg, #FF00B8 315.5447030067444deg)'

  return (
    <div>
      <input type="number" onChange={handleUpdatePercent} />
      <DashBoard percent={state} title="AI Score" dashBoardSize={188} />
    </div>
  )
}

export default App
