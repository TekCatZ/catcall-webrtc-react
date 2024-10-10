import { createBrowserRouter } from 'react-router-dom'
import Home from '../pages/Home'
import NotFound from '../pages/NotFound'
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
    element: <NotFound />,
  },
])
