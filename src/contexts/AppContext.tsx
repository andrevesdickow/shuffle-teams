import { createContext } from 'react'

type AppContextProps = {
  toggleTheme: () => void;
  currentTheme: 'light' | 'dark'
}

const AppContext = createContext<AppContextProps>({} as AppContextProps)

export default AppContext
