import { useRef, useState } from 'react'
import DashBoard from '..'
import './App.css'

function App() {
  const [state, setState] = useState(0)
  const ref = useRef<HTMLInputElement>(null)
  const handleUpdatePercent = () => {
    const percent = Number.parseInt(ref.current?.value ?? '0')
    setState(percent)
  }
  return (
    <div>
      <input type="number" ref={ref} />
      <button onClick={handleUpdatePercent}>confirm</button>
      <DashBoard percent={state} />
    </div>
  )
}

export default App
