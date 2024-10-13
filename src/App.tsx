import { RouterProvider } from 'react-router-dom'
import './App.css'
import { Suspense, useMemo, useState } from 'react'
import colors from 'nice-color-palettes'
import { routers } from './utils/routes'
import { ThemeContext } from './themeContext'

function App() {
  const colorsSet = useMemo(() => colors[Math.floor(Math.random() * 100)], [])
  const [meshGradient, setMeshGradient] = useState(localStorage.getItem('meshGradient') === 'true')

  const toggleGradient = () => {
    setMeshGradient((prev) => {
      localStorage.setItem('meshGradient', prev ? 'false' : 'true')
      return !prev
    })
  }
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThemeContext.Provider
        value={{
          colors: colorsSet,
          toggleGradient,
          meshGradient,
        }}>
        <RouterProvider router={routers} />
      </ThemeContext.Provider>
    </Suspense>
  )
}

export default App
