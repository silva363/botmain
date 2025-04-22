'use client';

import * as React from 'react';
import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
  darkTheme
} from '@rainbow-me/rainbowkit';
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets';
import {
  polygon,
  polygonMumbai
} from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import 'react-toastify/dist/ReactToastify.css';
import "react-toggle/style.css"
import 'bootstrap/dist/css/bootstrap.min.css';

const { wallets } = getDefaultWallets();

const config = getDefaultConfig({
  appName: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_NAME || '',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
  wallets: [
    ...wallets,
    {
      groupName: 'Quasarway',
      wallets: [argentWallet, trustWallet, ledgerWallet],
    },
  ],
  chains: [
    polygon,
    polygonMumbai
  ],
  ssr: true
});

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
