import { createBrowserRouter } from 'react-router-dom'
import Home from '../pages/Home'
import { ROUTES } from './const'

export const routers = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Home />,
  },
  {
    path: ROUTES.CONTACTS,
    element: <div>Contacts</div>,
  },
  {
    path: ROUTES.LOGIN,
    element: <div>Login</div>,
  },
  {
    path: '*',
    element: <div>404</div>,
  },
])
