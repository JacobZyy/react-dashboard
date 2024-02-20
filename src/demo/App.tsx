import { useState } from 'react'
import DashBoard from '..'
import './App.css'

function App() {
  const [state, setState] = useState(0)
  const handleUpdatePercent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percent = Number.parseInt(e.target.value ?? '0')
    setState(percent)
  }

  return (
    <div>
      <input type="number" onChange={handleUpdatePercent} />
      <DashBoard percent={state} />
    </div>
  )
}

export default App
