import { HTMLAttributes, ReactNode } from 'react'

interface FluentCardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
  addOnClasses?: string
}

const FluentCard = (props: FluentCardProps) => {
  const { children, addOnClasses, ...others } = props
  return (
    <div
      className={`flex flex-col align-center text-gray-100 bg-slate-500 bg-opacity-20 rounded-md gap-7 p-10 backdrop-blur-3xl ${addOnClasses}`}
      {...others}>
      {children}
    </div>
  )
}

export default FluentCard
