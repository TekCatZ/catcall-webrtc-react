import { useRouteError } from 'react-router-dom'

type ErrorType = {
  status?: number
  data?: string
  statusText?: string
  error: Error
}

const ErrorBoundary = () => {
  const error = useRouteError() as ErrorType

  console.error(error)

  if (error?.status === 500) {
    return (
      <div>
        <h1>Error</h1>
        <p>Server error</p>
      </div>
    )
  }

  return (
    <div>
      <h1>Error</h1>
      <p>{error?.data}</p>
    </div>
  )
}

export default ErrorBoundary
