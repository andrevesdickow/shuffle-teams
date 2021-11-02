import { useContext } from 'react'

import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material'
import { BrightnessMedium as BrightnessMediumIcon } from '@mui/icons-material'

import AppContext from '../../contexts/AppContext'

export default function Header() {
  const { toggleTheme } = useContext(AppContext)

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="div"
        >
          Sor<b>tchê</b>ador de <b>Times</b>
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box>
          <IconButton
            size="large"
            edge="end"
            aria-label="toggle theme"
            aria-controls="toggleTheme"
            aria-haspopup="true"
            onClick={toggleTheme}
            color="inherit"
          >
            <BrightnessMediumIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}