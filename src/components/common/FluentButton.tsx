interface FluentButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  // @param addOnClassName - Additional classes to be added to the button
  addOnClassName?: string
}

const FluentButton = (props: FluentButtonProps) => {
  const { children, addOnClassName, ...others } = props

  return (
    <button
      className={`rounded-full p-2 border-slate-300 hover:border-slate-300 hover:opacity-70 active:opacity-25 focus:outline-none ${addOnClassName}`}
      {...others}>
      {children}
    </button>
  )
}

export default FluentButton
