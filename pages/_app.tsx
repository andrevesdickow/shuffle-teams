import { useEffect, useMemo } from 'react'
import { AppProps } from 'next/app'
import { parseCookies } from 'nookies'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import { withStyles } from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { CacheProvider, EmotionCache } from '@emotion/react'
import isEmpty from 'lodash/isEmpty'
import AppContext from '../components/contexts/AppContext'

import usePersistedState from '../components/functions/usePersistedState'
import global from '../styles/global'
import light from '../styles/light'
import dark from '../styles/dark'
import { GetServerSideProps } from 'next'

import createEmotionCache from '../components/functions/createEmotionCache'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

function MyApp(props: MyAppProps) {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
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
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={currentTheme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <AppContext.Provider value={{ toggleTheme }}>
          <Component {...otherPageProps} />
        </AppContext.Provider>
      </ThemeProvider>
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
