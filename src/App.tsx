import { RouterProvider } from 'react-router-dom'
import './App.css'
import { Suspense } from 'react'
import { routers } from './utils/routes'

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={routers} />
    </Suspense>
  )
}

export default App
