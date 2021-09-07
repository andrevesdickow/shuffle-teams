import { createTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'

const light = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#008c80',
    },
    secondary: {
      main: '#01786d',
    },
    error: {
      main: red.A400,
    },
  },
})

export default light
