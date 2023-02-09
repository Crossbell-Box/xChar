import "../styles/globals.css"

import type { AppProps } from "next/app"
import NextNProgress from "nextjs-progressbar"
import { Hydrate, QueryClient } from "@tanstack/react-query"
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import { useState } from "react"
import { createClient, WagmiConfig } from "wagmi"
import { InitContractProvider } from "@crossbell/contract"
import { ConnectKitProvider, contractConfig } from "@crossbell/connect-kit"
import { Network } from "crossbell.js"

import { Layout } from "~/components/Layout"
import { createIDBPersister } from "~/lib/persister.client"
import { toGateway } from "~/lib/ipfs-parser"
import { connectors, provider } from "~/lib/wallet-config"
import { IPFS_GATEWAY } from "~/lib/constant"
import { NotificationModal } from "@crossbell/notification"

Network.setIpfsGateway(IPFS_GATEWAY)

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
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}
      >
        <InitContractProvider {...contractConfig}>
          <ConnectKitProvider ipfsLinkToHttpLink={toGateway}>
            <Hydrate state={pageProps.dehydratedState}>
              <NextNProgress
                options={{ easing: "linear", speed: 500, trickleSpeed: 100 }}
              />
              <Layout>
                <Component {...pageProps} />
              </Layout>
              <NotificationModal />
            </Hydrate>
          </ConnectKitProvider>
        </InitContractProvider>
      </PersistQueryClientProvider>
    </WagmiConfig>
  )
}
