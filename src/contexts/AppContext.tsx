import { createContext } from 'react'

type AppContextProps = {
  toggleTheme: () => void
}

const AppContext = createContext<AppContextProps>({} as AppContextProps)

export default AppContext
