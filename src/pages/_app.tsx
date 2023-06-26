import "../styles/globals.css"
import "@crossbell/connect-kit/colors.css"

import type { AppProps } from "next/app"
import NextNProgress from "nextjs-progressbar"
import { Hydrate, QueryClient } from "@tanstack/react-query"
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import { useState } from "react"
import { WagmiConfig } from "wagmi"
import { ConnectKitProvider, createWagmiConfig } from "@crossbell/connect-kit"
import { setIpfsGateway } from "crossbell/ipfs"

import { Layout } from "~/components/Layout"
import { createIDBPersister } from "~/lib/persister.client"
import { toGateway } from "~/lib/ipfs-parser"
import { IPFS_GATEWAY } from "~/lib/constant"
import { NotificationModal } from "@crossbell/notification"

setIpfsGateway(IPFS_GATEWAY)

const wagmiConfig = createWagmiConfig({
  appName: "xChar",
  walletConnectV2ProjectId: "eb22ab0e8a4d59fde61dc87a426346ac",
})

const persister = createIDBPersister()

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiConfig config={wagmiConfig}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}
      >
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
      </PersistQueryClientProvider>
    </WagmiConfig>
  )
}
