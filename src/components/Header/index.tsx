import {
  MdDarkMode as DarkModeIcon,
  MdLightMode as LightModeIcon,
  MdTranslate as TranslateIcon
} from 'react-icons/md';

import { filter, map } from 'lodash';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Box, Flex, Heading, Icon, IconButton, Menu, MenuButton, MenuList, MenuItem, Tooltip, useColorMode } from '@chakra-ui/react';

export default function Header() {
  const t = useTranslations('generic');
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();
  const { locales, locale: activeLocale } = router;
  const otherLocales = filter(locales, (locale) => locale !== activeLocale);

  return (
    <Flex
      as="header"
      height={["12", "16"]}
      bg="teal.500"
      justify="space-between"
      align="center"
      p="8"
    >
      <Box>
        <Heading
          size="lg"
        >
          Sor<b>tchê</b>ador
        </Heading>
      </Box>
      <Box>
        <Tooltip label={t(colorMode === 'light' ? 'darkMode' : 'lightMode')}>
          <IconButton
            aria-label="toggle theme"
            aria-controls="toggleTheme"
            aria-haspopup="true"
            size="sm"
            onClick={toggleColorMode}
            bg="transparent"
            icon={<Icon as={colorMode === 'light' ? DarkModeIcon : LightModeIcon} />}
          />
        </Tooltip>
        <Menu>
          <Tooltip label={t('changeLanguage')}>
            <MenuButton
              as={IconButton}
              aria-label="Lang menu"
              icon={<Icon as={TranslateIcon} />}
              size="sm"
              bg="transparent"
            />
          </Tooltip>
          <MenuList>
            {
              map(otherLocales, (locale) => {
                const { pathname, query, asPath } = router;
                const img = locale === 'pt' ? 'br' : 'us';

                return (
                  <Link
                    key={locale}
                    href={{ pathname, query }}
                    as={asPath}
                    locale={locale}
                    passHref
                  >
                    <MenuItem>
                      <Image
                        loading="lazy"
                        width="20"
                        height="14"
                        src={`https://flagcdn.com/w20/${img}.png`}
                        alt={locale}
                      />
                      &nbsp;{t(locale)}
                    </MenuItem>
                  </Link>
                );
              })
            }
          </MenuList>
        </Menu>
      </Box>
    </Flex>
  );
}
