import { SquaresIcon } from "~/components/icons/Squares"
import { XCharIcon } from "~/components/icons/XChar"
import { XFeedIcon } from "~/components/icons/XFeed"
import { XShopIcon } from "~/components/icons/XShop"
import { XSyncIcon } from "~/components/icons/XSync"
import { XLogIcon } from "~/components/icons/XLog"
import { Tooltip } from "~/components/Tooltip"
import { CrossbellIcon } from "~/components/icons/Crossbell"
import { RSS3Icon } from "~/components/icons/RSS3Icon"

const apps = [
  {
    name: "xChar",
    icon: <XCharIcon className="w-8 h-8 inline-block" />,
    url: "https://xchar.app/",
  },
  {
    name: "xFeed",
    icon: <XFeedIcon className="w-8 h-8 inline-block" />,
    url: "https://crossbell.io/feed",
  },
  {
    name: "xSync",
    icon: <XSyncIcon className="w-8 h-8 inline-block" />,
    url: "https://xsync.app/",
  },
  {
    name: "xShop",
    icon: <XShopIcon className="w-8 h-8 inline-block" />,
    text: "Coming soon",
  },
  {
    name: "xLog",
    icon: <XLogIcon className="w-8 h-8 inline-block" />,
    url: "https://xlog.app/",
  },
  {
    name: "Scan",
    icon: <CrossbellIcon className="w-8 h-8 inline-block p-[2px]" />,
    url: "https://scan.crossbell.io/",
  },
  {
    name: "Faucet",
    icon: <CrossbellIcon className="w-8 h-8 inline-block p-[2px]" />,
    url: "https://faucet.crossbell.io/",
  },
  {
    name: "RSS3",
    icon: <RSS3Icon className="w-8 h-8 inline-block" />,
    url: "https://rss3.io/",
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
