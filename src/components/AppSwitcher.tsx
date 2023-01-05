import { SquaresIcon } from "~/components/icons/Squares"
import { XCharIcon } from "~/components/icons/XChar"
import { XFeedIcon } from "~/components/icons/XFeed"
import { XShopIcon } from "~/components/icons/XShop"
import { XSyncIcon } from "~/components/icons/XSync"
import { Tooltip } from "~/components/Tooltip"

export const AppSwitcher = () => {
  return (
    <div className="relative">
      <div className="group">
        <SquaresIcon className="w-8 h-8 text-zinc-600 fill-current cursor-pointer" />
        <div className="group-hover:block hidden absolute top-full -right-10 pt-3">
          <div className="bg-white rounded-lg ring-1 ring-zinc-100 shadow-md sm:p-4 p-2">
            <ul className="flex space-x-2 text-center text-zinc-600 text-sm">
              <li>
                <a
                  href="https://xchar.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="block sm:px-4 px-2 sm:py-2 py-1 hover:bg-zinc-100 rounded-lg"
                >
                  <XCharIcon className="w-8 h-8 inline-block mb-1" />
                  <span>xChar</span>
                </a>
              </li>
              <li>
                <a
                  href="https://crossbell.io/feed"
                  target="_blank"
                  rel="noreferrer"
                  className="block sm:px-4 px-2 sm:py-2 py-1 hover:bg-zinc-100 rounded-lg"
                >
                  <XFeedIcon className="w-8 h-8 inline-block mb-1" />
                  <span>xFeed</span>
                </a>
              </li>
              <li>
                <a
                  href="https://xsync.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="block sm:px-4 px-2 sm:py-2 py-1 hover:bg-zinc-100 rounded-lg"
                >
                  <XSyncIcon className="w-8 h-8 inline-block mb-1" />
                  <span>xSync</span>
                </a>
              </li>
              <li>
                <Tooltip label="Coming soon" placement="bottom">
                  <div className="block sm:px-4 px-2 sm:py-2 py-1 hover:bg-zinc-100 rounded-lg relative">
                    <XShopIcon className="w-8 h-8 inline-block mb-1" />
                    <span>xShop</span>
                  </div>
                </Tooltip>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
