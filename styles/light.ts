import { createTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'

const light = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0070f3',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },
})

export default light
