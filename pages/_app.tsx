import { useState } from 'react'
import { AppProps } from 'next/app'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { withStyles } from '@mui/styles'
import AppContext from '../contexts/AppContext'

import global from '../styles/global'
import light from '../styles/light'
import dark from '../styles/dark'

interface MyAppProps extends AppProps {
  pageProps: any
}

function MyApp(props: MyAppProps) {
  const {
    Component,
    pageProps
  } = props

  // const [theme, setTheme] = usePersistedTheme('SHUFFLE_TEAMS_THEME', 'light')
  const [theme, setTheme] = useState<string>('light')

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const currentTheme = theme === 'light' ? light : dark

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <AppContext.Provider value={{ toggleTheme }}>
        <Component {...pageProps} />
      </AppContext.Provider>
    </ThemeProvider>
  )
}

export default withStyles(global)(MyApp)
