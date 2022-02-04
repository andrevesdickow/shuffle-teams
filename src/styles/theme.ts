import { extendTheme } from '@chakra-ui/react'

// Create a theme instance.
export const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: true
  },
  // colors: {
  //   gray: {
  //     "900": "#181B23",
  //     "800": "#1F2029",
  //     "700": "#353646",
  //     "600": "#4B4D63",
  //     "500": "#616480",
  //     "400": "#797D9A",
  //     "300": "#9699B0",
  //     "200": "#B3B5C6",
  //     "100": "#D1D2DC",
  //     "50": "#EEEEF2",
  //   }
  // },
  fonts: {
    heading: 'Roboto',
    body: 'Roboto'
  },
  styles: {
    global: {
      // body: {
      //   bg: 'gray.900',
      //   color: 'gray.50'
      // },
      '::-webkit-scrollbar': {
        width: 5,
        height: 5
      },
      '::-webkit-scrollbar-thumb': {
        background: '#008c80'
      },
      '::-webkit-scrollbar-track': {
        background: '#01312c'
      },

      '::selection': {
        color: '#ffffff',
        backgroundColor: '#008c80',
      }
    }
  }
})