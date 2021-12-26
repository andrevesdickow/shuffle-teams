import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { useContext, useState } from 'react'

import { filter, map } from 'lodash'
import { useTranslations } from 'next-intl'

import {
  AppBar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  Theme
} from '@mui/material'
import {
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Translate as TranslateIcon
} from '@mui/icons-material'

import AppContext from '../../contexts/AppContext'
import { makeStyles } from '@mui/styles'

const ITEM_HEIGHT = 48

const useStyles = makeStyles((theme: Theme) => ({
  buttonsList: {
    display: 'flex',
    gap: theme.spacing(1)
  },
  langImg: {
    marginRight: theme.spacing(1)
  }
}))

export default function Header() {
  const t = useTranslations('generic')
  const router = useRouter()
  const { locales, locale: activeLocale } = router
  const otherLocales = filter(locales, (locale) => locale !== activeLocale)

  const { toggleTheme, currentTheme } = useContext(AppContext)

  const classes = useStyles()

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
        <Box className={classes.buttonsList}>
          <IconButton
            size="large"
            edge="end"
            aria-label="toggle theme"
            aria-controls="toggleTheme"
            aria-haspopup="true"
            onClick={toggleTheme}
            color="inherit"
          >
            <Tooltip title={t(currentTheme === 'light' ? 'darkMode' : 'lightMode')}>
              {
                currentTheme === 'light'
                  ? (<DarkModeIcon />)
                  : (<LightModeIcon />)
              }
            </Tooltip>
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
            <Tooltip title={t('changeLanguage')}>
              <TranslateIcon />
            </Tooltip>
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
            {
              map(otherLocales, (locale) => {
                const { pathname, query, asPath } = router
                const img = locale === 'pt' ? 'br' : 'us'

                return (
                  <MenuItem key={locale} onClick={handleCloseMenu}>
                    <Image
                      loading="lazy"
                      width="20"
                      height="14"
                      src={`https://flagcdn.com/w20/${img}.png`}
                      alt={locale}
                      className={classes.langImg}
                    />
                    <Link
                      href={{ pathname, query }}
                      as={asPath}
                      locale={locale}
                    >
                      {t(locale)}
                    </Link>
                  </MenuItem>
                )
              })
            }
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}