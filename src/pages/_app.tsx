import "../styles/globals.css"
import type { AppProps } from "next/app"
import { Hydrate, QueryClient } from "@tanstack/react-query"
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import { createIDBPersister } from "~/lib/persister.client"
import { useState } from "react"
import { configureChains, createClient, WagmiConfig } from "wagmi"
import { jsonRpcProvider } from "wagmi/providers/jsonRpc"
import {
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit"
import {
  injectedWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  braveWallet,
} from "@rainbow-me/rainbowkit/wallets"
import NextNProgress from "nextjs-progressbar"
import { CSB_SCAN, IPFS_GATEWAY } from "~/lib/env"
import { Layout } from "~/components/Layout"

import "@rainbow-me/rainbowkit/styles.css"

const { chains, provider } = configureChains(
  [
    {
      id: 3737,
      name: "Crossbell",
      network: "crossbell",
      rpcUrls: {
        default: "https://rpc.crossbell.io",
      },
      iconUrl: `${IPFS_GATEWAY}QmS8zEetTb6pwdNpVjv5bz55BXiSMGP9BjTJmNcjcUT91t`,
      nativeCurrency: {
        decimals: 18,
        name: "Crossbell Token",
        symbol: "CSB",
      },
      blockExplorers: {
        default: {
          name: "Crossbell Explorer",
          url: CSB_SCAN,
        },
      },
      testnet: false,
    } as any,
  ],
  [jsonRpcProvider({ rpc: (chain) => ({ http: chain.rpcUrls.default }) })],
  {
    pollingInterval: 1000,
  },
)

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      metaMaskWallet({ chains }),
      walletConnectWallet({ chains }),
      braveWallet({ chains, shimDisconnect: true }),
      coinbaseWallet({ appName: "xChar", chains }),
      injectedWallet({ chains, shimDisconnect: true }),
    ],
  },
])

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

const persister = createIDBPersister()

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister }}
        >
          <Hydrate state={pageProps.dehydratedState}>
            <NextNProgress
              options={{ easing: "linear", speed: 500, trickleSpeed: 100 }}
            />
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </Hydrate>
        </PersistQueryClientProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
