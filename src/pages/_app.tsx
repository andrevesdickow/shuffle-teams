import { NextIntlProvider } from 'next-intl';
import { AppProps } from 'next/app';

import {
  ChakraProvider,
  createLocalStorageManager
} from '@chakra-ui/react';

import { FormDataProvider } from '../contexts/FormDataContext';
import { theme } from '../styles/theme';

const manager = createLocalStorageManager('sortcheador_color_mode');

interface MyAppProps extends AppProps {
  cookies?: string;
}
export default function MyApp({ Component, pageProps }: MyAppProps) {
  return (
    <NextIntlProvider messages={pageProps.messages}>
      <ChakraProvider
        theme={theme}
        colorModeManager={manager}
      >
        <FormDataProvider>
          <Component {...pageProps} />
        </FormDataProvider>
      </ChakraProvider>
    </NextIntlProvider>
  );
}
