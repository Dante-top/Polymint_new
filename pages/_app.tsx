import { ChakraProvider } from '@chakra-ui/react';
import { extendTheme } from '@chakra-ui/react';
import { publicProvider } from 'wagmi/providers/public';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { wagmiClient, ethereumClient, projectId, WagmiConfig, Web3Modal } from '../src/web3/web3';
import '../styles/global.css';

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({ config });

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <WagmiConfig config={wagmiClient}>
        <SessionProvider session={pageProps.session} refetchInterval={0}>
          <Component {...pageProps} />
        </SessionProvider>
        <Web3Modal
          projectId={projectId}
          explorerExcludedWalletIds={'ALL'}
          explorerRecommendedWalletIds={[
            process.env.NEXT_PUBLIC_METAMASK_WALLET_ID as string,
            process.env.NEXT_PUBLIC_COINBASE_WALLET_ID as string,
          ]}
          ethereumClient={ethereumClient}
        />
      </WagmiConfig>
    </ChakraProvider>
  );
};

export default MyApp;
