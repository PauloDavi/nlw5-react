import { useState, createContext, ReactNode, useContext, useEffect } from 'react'

export type Theme = 'light' | 'dark'

interface ThemeContextProps {
  theme: Theme
  toggleTheme: () => void
}

interface ThemeContextProviderProps {
  children: ReactNode
}

export const ThemeContext = createContext({} as ThemeContextProps)

export function ThemeContextProvider({ children }: ThemeContextProviderProps) {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const userTheme = (localStorage.getItem('podcaster-theme') as Theme) || 'light'
    setTheme(userTheme)

    if (userTheme === 'dark') {
      document.body.classList.add('dark-mode')
    }
  }, [setTheme])

  function toggleTheme() {
    setTheme((e) => {
      if (e === 'dark') {
        document.body.classList.remove('dark-mode')
        localStorage.setItem('podcaster-theme', 'light')
        return 'light'
      }

      document.body.classList.add('dark-mode')
      localStorage.setItem('podcaster-theme', 'dark')
      return 'dark'
    })
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  return useContext(ThemeContext)
}
