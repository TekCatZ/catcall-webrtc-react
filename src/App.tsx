import { RouterProvider } from 'react-router-dom'
import './App.css'
import { Suspense, useMemo, useState } from 'react'
import colors from 'nice-color-palettes'

import { routers } from './utils/routes'
import { ThemeContext } from './contexts/themeContext'
import { CallContextProvider } from './contexts/callContext/callSocketContext'
// import Logger from './utils/logger'

function App() {
  const colorsSet = useMemo(() => colors[Math.floor(Math.random() * 100)], [])
  const [meshGradient, setMeshGradient] = useState(!(localStorage.getItem('meshGradient') === 'false'))

  const toggleGradient = () => {
    setMeshGradient((prev) => {
      localStorage.setItem('meshGradient', prev ? 'false' : 'true')
      return !prev
    })
  }

  // Import the functions you need from the SDKs you need

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional

  // Logger.mode()
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
