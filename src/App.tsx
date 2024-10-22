import { RouterProvider } from 'react-router-dom'
import './App.css'
import { Suspense, useMemo, useState } from 'react'
import colors from 'nice-color-palettes'
import { routers } from './utils/routes'
import { ThemeContext } from './contexts/themeContext'
import { CallContextProvider } from './contexts/callContext/callSocketContext'

function App() {
  const colorsSet = useMemo(() => colors[Math.floor(Math.random() * 100)], [])
  const [meshGradient, setMeshGradient] = useState(
    !(localStorage.getItem('meshGradient') === 'false'),
  )

  const toggleGradient = () => {
    setMeshGradient((prev) => {
      localStorage.setItem('meshGradient', prev ? 'false' : 'true')
      return !prev
    })
  }
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallContextProvider>
        <ThemeContext.Provider
          value={{
            colors: colorsSet,
            toggleGradient,
            meshGradient,
          }}>
          <RouterProvider router={routers} />
        </ThemeContext.Provider>
      </CallContextProvider>
    </Suspense>
  )
}

export default App
