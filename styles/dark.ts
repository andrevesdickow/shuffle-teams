import { createTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'

const dark = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#004391',
    },
    secondary: {
      main: '#115c55',
    },
    error: {
      main: red.A400,
    },
  },
  // components: {
  //   MuiAppBar: {
  //     defaultProps: {
  //       enableColorOnDark: true,
  //     },
  //   },
  // },
})

export default dark
