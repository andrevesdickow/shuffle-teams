import { createTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'

const dark = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#01312c',
    },
    secondary: {
      main: '#0b3833',
    },
    error: {
      main: red.A400,
    },
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        enableColorOnDark: true,
      },
    },
  },
})

export default dark
