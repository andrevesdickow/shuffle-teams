import { useEffect, useMemo } from 'react'
import { AppProps } from 'next/app'
import { parseCookies } from 'nookies'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import { withStyles } from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import isEmpty from 'lodash/isEmpty'
import AppContext from '../components/contexts/AppContext'

import usePersistedState from '../components/functions/usePersistedState'
import global from '../styles/global'
import light from '../styles/light'
import dark from '../styles/dark'
import { GetServerSideProps } from 'next'

const cache = createCache({ key: 'css', prepend: true })
cache.compat = true

function MyApp(props: AppProps) {
  const {
    Component,
    pageProps: {
      cookieTheme,
      ...otherPageProps
    }
  } = props

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  const [theme, setTheme] = usePersistedState('SHUFFLE_TEAMS_THEME', !isEmpty(cookieTheme) ? cookieTheme : light)

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
          <Component {...otherPageProps} />
        </ThemeProvider>
      </AppContext.Provider>
    </CacheProvider>
  )
}

export default withStyles(global)(MyApp)

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { 'SHUFFLE_TEAMS_THEME': cookieTheme } = parseCookies(ctx)

  return {
    props: {
      cookieTheme,
    }
  }
}
