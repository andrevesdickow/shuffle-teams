import { AppProps } from 'next/app'
import { CssBaseline, ThemeProvider } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
import { CacheProvider, EmotionCache } from '@emotion/react'
import AppContext from '../components/contexts/AppContext'

import usePersistedTheme from '../components/functions/usePersistedTheme'
import global from '../styles/global'
import light from '../styles/light'
import dark from '../styles/dark'

import createEmotionCache from '../components/functions/createEmotionCache'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache,
  pageProps: any
}

function MyApp(props: MyAppProps) {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps
  } = props

  console.warn({ props })

  const [theme, setTheme] = usePersistedTheme('SHUFFLE_TEAMS_THEME', 'light')

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const currentTheme = theme === 'light' ? light : dark

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={currentTheme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <AppContext.Provider value={{ toggleTheme }}>
          <Component {...pageProps} />
        </AppContext.Provider>
      </ThemeProvider>
    </CacheProvider>
  )
}

export default withStyles(global)(MyApp)
