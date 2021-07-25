import { AppProps } from 'next/app'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import theme from '../styles/theme'

import '../styles/globals.css'

const cache = createCache({ key: 'css', prepend: true })
cache.compat = true

function MyApp(props: AppProps) {
  const { Component, pageProps } = props

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  )
}

export default MyApp
