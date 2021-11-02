import { Theme } from '@mui/material'
import { createStyles } from '@mui/styles'

const styles = (theme: Theme) => createStyles({
  main: {
    minHeight: '100vh',
    height: 'auto',
  },

  container: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100% - 64px)',
    justifyContent: 'center',

    [theme.breakpoints.down('sm')]: {
      height: 'auto'
    }
  },

  footer: {
    width: '100%',
    height: '100px',
    borderTop: '1px solid #eaeaea',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    '& a': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexGrow: 1,
    }
  },

  header: {
    padding: '2rem 0',
  },

  title: {
    margin: 0,
    lineHeight: '1.15',
    fontSize: '4rem',
    textAlign: 'center',
    '& b': {
      color: theme.palette.primary.main,
    }
  },

  description: {
    textAlign: 'center',
    lineHeight: '1.5',
    fontSize: '1.5rem',
  },

  code: {
    background: '#fafafa',
    color: theme.palette.getContrastText('#fafafa'),
    borderRadius: 5,
    padding: '0.75rem',
    fontSize: '1.1rem',
    fontFamily: 'Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace',
  },

  logo: {
    height: '1em',
    marginLeft: '0.5rem',
  },

  integrantName: {
    textTransform: 'capitalize',
  },

  grid: {
    '@media (max-width: 600px)': {
      width: '100%',
      flexDirection: 'column',
    }
  },

  cardMembersToRating: {
    marginTop: theme.spacing(2),
  },

  membersToRating: {
    display: 'flex',
    alignItems: 'center',

    '& legend': {
      marginLeft: theme.spacing(1)
    }
  }
})

export default styles
