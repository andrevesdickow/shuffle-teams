import { useState } from 'react'
import { AppProps } from 'next/app'
import { NextIntlProvider } from 'next-intl'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { withStyles } from '@mui/styles'
import AppContext from '../contexts/AppContext'

import global from '../styles/global'
import light from '../styles/light'
import dark from '../styles/dark'

function MyApp({ Component, pageProps }: AppProps) {
  // const [theme, setTheme] = usePersistedTheme('SHUFFLE_TEAMS_THEME', 'light')
  const [theme, setTheme] = useState<string>('light')

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const currentTheme = theme === 'light' ? light : dark

  return (
    <NextIntlProvider messages={pageProps.messages}>
      <ThemeProvider theme={currentTheme}>
        <CssBaseline />
        <AppContext.Provider value={{ toggleTheme }}>
          <Component {...pageProps} />
        </AppContext.Provider>
      </ThemeProvider>
    </NextIntlProvider>
  )
}

export default withStyles(global)(MyApp)
