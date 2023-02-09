import { SquaresIcon } from "~/components/icons/Squares"
import { Tooltip } from "~/components/Tooltip"
import {
  XCharLogo,
  XFeedLogo,
  XShopLogo,
  XSyncLogo,
  CrossbellChainLogo,
} from "@crossbell/ui"
import { Image } from "~/components/ui/Image"

const apps = [
  {
    name: "xChar",
    icon: <XCharLogo className="w-8 h-8" />,
    url: "https://xchar.app/",
  },
  {
    name: "xFeed",
    icon: <XFeedLogo className="w-8 h-8" />,
    url: "https://crossbell.io/feed",
  },
  {
    name: "xSync",
    icon: <XSyncLogo className="w-8 h-8" />,
    url: "https://xsync.app/",
  },
  {
    name: "xShop",
    icon: <XShopLogo className="w-8 h-8" />,
    text: "Coming soon",
  },
  {
    name: "xLog",
    icon: (
      <div className="w-8 h-8">
        <Image src="/logos/xlog.svg" alt="xLog" />
      </div>
    ),
    url: "https://xlog.app/",
  },
  {
    name: "Scan",
    icon: <CrossbellChainLogo className="w-8 h-8 p-[2px] text-[#E7B75B]" />,
    url: "https://scan.crossbell.io/",
  },
  {
    name: "Faucet",
    icon: <CrossbellChainLogo className="w-8 h-8 p-[2px] text-[#E7B75B]" />,
    url: "https://faucet.crossbell.io/",
  },
  {
    name: "Export",
    icon: <CrossbellChainLogo className="w-8 h-8 p-[2px] text-[#E7B75B]" />,
    url: "https://export.crossbell.io/",
  },
  {
    name: "SDK",
    icon: <CrossbellChainLogo className="w-8 h-8 p-[2px] text-[#E7B75B]" />,
    url: "https://crossbell-box.github.io/crossbell.js/",
  },
]

export const AppSwitcher = () => {
  return (
    <div className="relative">
      <div className="group">
        <SquaresIcon className="w-8 h-8 text-zinc-600 fill-current cursor-pointer" />
        <div className="group-hover:block hidden absolute top-full -right-6 pt-3">
          <div className="bg-white rounded-xl ring-1 ring-zinc-100 shadow-md p-2">
            <ul className="text-center text-zinc-600 text-sm grid grid-cols-4 gap-x-2 gap-y-2 w-72">
              {apps.map((app) => (
                <li key={app.name}>
                  {app.url ? (
                    <a
                      href={app.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-col items-center sm:px-4 px-2 sm:py-2 py-1 hover:bg-zinc-100 rounded-lg"
                    >
                      {app.icon}
                      <span>{app.name}</span>
                    </a>
                  ) : (
                    <Tooltip label={app.text!} placement="bottom">
                      <div className="flex flex-col items-center sm:px-4 px-2 sm:py-2 py-1 hover:bg-zinc-100 rounded-lg relative">
                        {app.icon}
                        <span>{app.name}</span>
                      </div>
                    </Tooltip>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
