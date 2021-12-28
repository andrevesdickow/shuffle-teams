import { createContext, useContext } from 'react'

export type ThemeMode = 'light' | 'dark'

interface IConfigContextProps {
  toggleTheme: () => void;
  theme: ThemeMode;
}

// interface IConfigProviderProps {
//   children: ReactNode;
// }

export const ConfigContext = createContext<IConfigContextProps>({} as IConfigContextProps)

// export function ConfigProvider({ children }: IConfigProviderProps) {
//   // const [theme, setTheme] = usePersistedTheme('SHUFFLE_TEAMS_THEME', 'light')
//   const [theme, setTheme] = useState<ThemeMode>('light')

//   const toggleTheme = () => {
//     setTheme(theme === 'light' ? 'dark' : 'light')
//   }

//   return (
//     <ConfigContext.Provider value={{ toggleTheme, theme }}>
//       {children}
//     </ConfigContext.Provider>
//   )
// }

export function useConfig() {
  const context = useContext(ConfigContext)
  return context
}