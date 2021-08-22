import { createTheme } from '@material-ui/core/styles'
import { red } from '@material-ui/core/colors'

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
  // components: {
  //   MuiAppBar: {
  //     defaultProps: {
  //       enableColorOnDark: true,
  //     },
  //   },
  // },
})

export default light
