import { Theme } from '@mui/material'
import { createStyles } from '@mui/styles'

const styles = (theme: Theme) => createStyles({
  main: {
    minHeight: '100vh',
    height: 'auto',
  },

  container: {
    height: '100%',
    minHeight: 'calc(100vh - 64px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',

    [theme.breakpoints.down('sm')]: {
      height: 'auto'
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

  button: {
    [theme.breakpoints.up('sm')]: {
      marginRight: theme.spacing(1),

      '& > :first-child': {
        marginRight: 0
      }
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(1),

      '& > :nth-child(1)': {
        marginTop: 0
      }
    }
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
