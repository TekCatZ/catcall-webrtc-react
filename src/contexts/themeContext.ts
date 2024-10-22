import { createContext } from 'react'

interface ThemeContextType {
  colors: string[]
  //TODO: Remove if not needed
  currentTheme?: string
  meshGradient?: boolean
  toggleTheme?: () => void
  toggleGradient?: () => void
}

const defaultContextValue: ThemeContextType = {
  colors: [],
  currentTheme: 'light',
  meshGradient: true,
  toggleTheme: () => {},
}

export const ThemeContext = createContext<ThemeContextType>(defaultContextValue)
