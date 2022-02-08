import { extendTheme } from '@chakra-ui/react'
import { isEmpty } from 'lodash'
import { parseCookies } from 'nookies'

const cookies = parseCookies()
const initialColorMode = !isEmpty(cookies['chakra-ui-color-mode'])
  ? cookies['chakra-ui-color-mode']
  : 'light'

export const theme = extendTheme({
  config: {
    initialColorMode,
    // useSystemColorMode: true
  },
  fonts: {
    heading: 'Roboto',
    body: 'Roboto'
  },
  styles: {
    global: {
      '::-webkit-scrollbar': {
        width: '5px',
        height: '5px'
      },
      '::-webkit-scrollbar-thumb': {
        background: '#319795'
      },
      '::-webkit-scrollbar-track': {
        background: '#01312c'
      },

      '::selection': {
        color: '#ffffff',
        backgroundColor: '#319795',
      }
    }
  }
})