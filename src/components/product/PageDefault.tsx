import { MeshGradientRenderer } from '@johnn-e/react-mesh-gradient'
import { ReactNode, useContext } from 'react'
import { ThemeContext } from '../../themeContext'
interface PageDefaultProps {
  children?: ReactNode
  filter?: string
}

// This component require an ThemeContext.Provider to be used.
// The ThemeContext.Provider will provide the colors for the MeshGradientRenderer.
const PageDefault = (props: PageDefaultProps) => {
  const { children, filter } = props
  const colors = useContext(ThemeContext)

  return (
    <>
      <MeshGradientRenderer
        className={`w-full h-full absolute top-0 left-0' ${filter ? `filter ${filter}` : ''}`}
        colors={colors}
        speed={0.02}
      />
      {children}
    </>
  )
}

export default PageDefault
