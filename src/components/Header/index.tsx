import Image from 'next/image'
import Link from 'next/link'

import { useContext, useState } from 'react'

import { useTranslations } from 'next-intl'

import {
  AppBar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material'
import {
  BrightnessMedium as BrightnessMediumIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material'

import AppContext from '../../contexts/AppContext'

const ITEM_HEIGHT = 48

export default function Header() {
  const t = useTranslations('generic')

  const { toggleTheme } = useContext(AppContext)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl)
  const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="div"
        >
          Sor<b>tchê</b>ador
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
          <IconButton
            aria-label="more"
            id="lang-button"
            aria-controls="lang-menu"
            aria-expanded={openMenu ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleClickMenu}
            color="inherit"
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="lang-menu"
            MenuListProps={{
              'aria-labelledby': 'lang-button',
            }}
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleCloseMenu}
            PaperProps={{
              style: {
                maxHeight: ITEM_HEIGHT * 4.5,
                width: '20ch',
              },
            }}
          >
            <MenuItem onClick={handleCloseMenu}>
              <Image
                loading="lazy"
                width="20"
                height="14"
                src="https://flagcdn.com/w20/br.png"
                alt="Brazil"
              />
              <Link href="/pt">
                {t('portuguese')}
              </Link>
            </MenuItem>
            <MenuItem onClick={handleCloseMenu}>
              <Image
                loading="lazy"
                width="20"
                height="14"
                src="https://flagcdn.com/w20/us.png"
                alt="USA"
              />
              <Link href="/en">
                {t('english')}
              </Link>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}