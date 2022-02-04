import { NextPageContext } from 'next'
import { AppProps } from 'next/app'
import { NextIntlProvider } from 'next-intl'
import { get } from 'lodash'

import {
  ChakraProvider,
  cookieStorageManager,
  localStorageManager,
} from '@chakra-ui/react'

import { FormDataProvider } from '../contexts/FormDataContext'
import { theme } from '../styles/theme'

interface MyAppProps extends AppProps {
  cookies?: string;
}
export default function MyApp({ Component, pageProps, cookies }: MyAppProps) {
  return (
    <NextIntlProvider messages={pageProps.messages}>
      <ChakraProvider
        theme={theme}
        colorModeManager={
          typeof cookies === 'string'
            ? cookieStorageManager(cookies)
            : localStorageManager
        }
      >
        <FormDataProvider>
          <Component {...pageProps} />
        </FormDataProvider>
      </ChakraProvider>
    </NextIntlProvider>
  )
}

interface GetInitialProps extends NextPageContext { }

MyApp.getInitialProps = ({ req }: GetInitialProps) => {
  return {
    // first time users will not have any cookies and you may not return
    // undefined here, hence ?? is necessary
    cookies: get(req, 'headers.cookie', '')
  }
}
