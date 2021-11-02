const styles = {
  '@global': {
    'html': {
      padding: 0,
      margin: 0,
      fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
    },

    'body': {
      padding: 0,
      margin: 0,
      fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
    },

    'a': {
      color: 'inherit',
      textDecoration: 'none',
    },

    '*': {
      boxSizing: 'border-box',
    },

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

export default styles