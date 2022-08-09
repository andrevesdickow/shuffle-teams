import { extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({
  config: {
    useSystemColorMode: true
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