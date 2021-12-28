import { useState } from 'react'

import { AppProps } from 'next/app'
import { NextIntlProvider } from 'next-intl'

import { CssBaseline, ThemeProvider } from '@mui/material'
import { withStyles } from '@mui/styles'

import { ConfigContext, ThemeMode } from '../contexts/ConfigContext'
import { FormDataProvider } from '../contexts/FormDataContext'
import light from '../styles/light'
import dark from '../styles/dark'

import global from '../styles/global'

function MyApp({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState<ThemeMode>('light')

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const currentTheme = theme === 'dark' ? dark : light

  return (
    <NextIntlProvider messages={pageProps.messages}>
      <ThemeProvider theme={currentTheme}>
        <CssBaseline />
        <ConfigContext.Provider value={{ theme, toggleTheme }}>
          <FormDataProvider>
            <Component {...pageProps} />
          </FormDataProvider>
        </ConfigContext.Provider>
      </ThemeProvider>
    </NextIntlProvider>
  )
}

export default withStyles(global)(MyApp)
