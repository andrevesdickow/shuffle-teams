import { useMemo } from 'react'
import { AppProps } from 'next/app'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
// import theme from '../styles/theme'
import AppContext from '../components/contexts/AppContext'

import '../styles/globals.css'
import usePersistedState from '../components/functions/usePersistedState'
import light from '../styles/light'
import dark from '../styles/dark'

const cache = createCache({ key: 'css', prepend: true })
cache.compat = true

function MyApp(props: AppProps) {
  const { Component, pageProps } = props

  const [theme, setTheme] = usePersistedState('SHUFFLE_TEAMS_THEME', light)

  const currentTheme = useMemo(
    () => createTheme(theme),
    [theme]
  )

  const toggleTheme = () => {
    setTheme(theme.palette.mode === 'light' ? dark : light)
  }

  return (
    <CacheProvider value={cache}>
      <AppContext.Provider value={{ toggleTheme }}>
        <ThemeProvider theme={currentTheme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </AppContext.Provider>
    </CacheProvider>
  )
}

export default MyApp
