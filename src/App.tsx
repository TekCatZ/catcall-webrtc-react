import { RouterProvider } from 'react-router-dom'
import './App.css'
import { Suspense, useMemo } from 'react'
import colors from 'nice-color-palettes'
import { routers } from './utils/routes'
import { ThemeContext } from './themeContext'

function App() {
  const colorsSet = useMemo(() => colors[Math.floor(Math.random() * 100)], [])
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThemeContext.Provider value={colorsSet}>
        <RouterProvider router={routers} />
      </ThemeContext.Provider>
    </Suspense>
  )
}

export default App
