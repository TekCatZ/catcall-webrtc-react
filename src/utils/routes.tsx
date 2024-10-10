import { createBrowserRouter } from 'react-router-dom'
import Home from '../pages/home/Home'
import NotFound from '../pages/NotFound'
import ErrorBoundary from '../pages/ErrorBoundary'
import { ROUTES } from './const'

export const routers = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Home />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: ROUTES.CONTACTS,
    element: <div>Contacts</div>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: ROUTES.LOGIN,
    element: <div>Login</div>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '*',
    element: <NotFound />,
    errorElement: <ErrorBoundary />,
  },
])
