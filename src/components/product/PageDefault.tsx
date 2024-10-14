import { MeshGradientRenderer } from '@johnn-e/react-mesh-gradient'
import { ReactNode, useContext } from 'react'
import { ThemeContext } from '../../contexts/themeContext'
import Toggle from '../common/Toggle'

interface PageDefaultProps {
  children?: ReactNode
  filter?: string
}

// This component require an ThemeContext.Provider to be used.
// The ThemeContext.Provider will provide the colors for the MeshGradientRenderer.
const PageDefault = (props: PageDefaultProps) => {
  const { children, filter } = props
  const { colors: themeColors, meshGradient, toggleGradient } = useContext(ThemeContext)

  return (
    <>
      <header className='absolute right-0 top-0  p-4'>
        <Toggle label='Gradient Background' value={meshGradient} onClick={toggleGradient} />
      </header>
      {meshGradient ? (
        <MeshGradientRenderer
          className={`w-full h-full absolute top-0 left-0 ${filter ? `filter ${filter}` : ''}`}
          colors={themeColors}
          speed={0.005}
        />
      ) : null}

      {children}
    </>
  )
}

export default PageDefault
