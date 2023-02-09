import { Button } from "~/components/ui/Button"
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid"
import { UniLink } from "~/components/ui/UniLink"
import { BlockchainIcon } from "~/components/icons/Blockchain"
import { toGateway } from "~/lib/ipfs-parser"
import { Image } from "~/components/ui/Image"
import { XFeedLogo } from "@crossbell/ui"
import { Menu } from "~/components/ui/Menu"

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
      icon: (
        <div className="w-4 h-4">
          <Image
            alt="Hoot It"
            src="/logos/ipfs.svg"
            className="rounded"
            width={16}
            height={16}
          />
        </div>
      ),
      url: toGateway(ipfsUri || ""),
    },
    {
      text: "View on xFeed",
      icon: <XFeedLogo className="w-4 h-4" />,
      url: `https://crossbell.io/@${handle}`,
    },
    {
      text: "View on xLog",
      icon: (
        <div className="w-4 h-4">
          <Image
            alt="xLog"
            src="/logos/xlog.svg"
            className="rounded"
            width={16}
            height={16}
          />
        </div>
      ),
      url: `https://${handle}.xlog.app`,
    },
    {
      text: "View on Hoot It",
      icon: (
        <div className="w-4 h-4">
          <Image
            alt="Hoot It"
            src="/logos/hoot.svg"
            className="rounded"
            width={16}
            height={16}
          />
        </div>
      ),
      url: `https://hoot.it/search/${handle}.csb/activities`,
    },
    {
      text: "View on Crossbell Scan",
      icon: <BlockchainIcon className="fill-[#c09526]" />,
      url: `https://scan.crossbell.io/address/${address}`,
    },
  ]

  return (
    <>
      <div className="relative inline-block align-middle h-7">
        <Menu
          target={
            <Button variant="text" aria-label="more">
              <EllipsisHorizontalIcon className="w-7 h-7" />
            </Button>
          }
          dropdown={
            <div className="pt-2 text-gray-600 w-60">
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
          }
        />
      </div>
    </>
  )
}
