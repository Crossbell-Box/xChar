import { Button } from "~/components/ui/Button"
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid"
import {
  BellIcon,
  DocumentMagnifyingGlassIcon,
} from "@heroicons/react/24/outline"
import { UniLink } from "~/components/ui/UniLink"
import { BlockchainIcon } from "~/components/icons/Blockchain"
import { RSS3Icon } from "~/components/icons/RSS3"
import { toGateway } from "~/lib/ipfs-parser"

export const MoreButton = ({
  handle,
  address,
  ipfsUri,
}: {
  handle: string
  address?: string
  ipfsUri?: string
}) => {
  const moreMenuItems = [
    {
      text: "View metadata",
      icon: <DocumentMagnifyingGlassIcon className="w-4 h-4" />,
      url: toGateway(ipfsUri || ""),
    },
    {
      text: "View on xFeed",
      icon: <BellIcon className="w-4 h-4" />,
      url: `https://crossbell.io/@${handle}`,
    },
    {
      text: "View on Crossbell Scan",
      icon: <BlockchainIcon />,
      url: `https://scan.crossbell.io/address/${address}`,
    },
    {
      text: "View on RSS3",
      icon: <RSS3Icon />,
      url: `https://rss3.io/result?search=${handle}.csb`,
    },
  ]

  return (
    <>
      <div className="relative inline-block align-middle h-7 group">
        <Button
          variant="text"
          onClick={(e) => {
            e.stopPropagation()
          }}
          aria-label="more"
        >
          <EllipsisHorizontalIcon className="w-7 h-7" />
        </Button>
        <div className="absolute hidden right-0 sm:left-0 pt-2 group-hover:block top-full z-10 text-gray-600 w-60">
          <div className="bg-white rounded-lg ring-1 ring-zinc-100 min-w-[140px] shadow-md py-2 text-sm">
            {moreMenuItems.map((item) => {
              return (
                <UniLink
                  key={item.text}
                  href={item.url}
                  className="h-10 flex w-full space-x-2 items-center px-3 hover:bg-gray-100"
                >
                  <span className="fill-gray-500 flex">{item.icon}</span>
                  <span>{item.text}</span>
                </UniLink>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
