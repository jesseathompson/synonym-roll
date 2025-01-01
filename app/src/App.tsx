import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import cinnamonRoll from './assets/cinnamonroll.png';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        {/* <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a> */}
      </div>
      <h1>Synonym Roll</h1>
      <div className="card">
      <img src={cinnamonRoll} alt="Cinnamon Roll" />
      </div>
      <p className="game-owners">
        A game created and owned by Lisa Thompson and Jesse Thompson
      </p>
    </>
  )
}

export default App
