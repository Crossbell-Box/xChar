import { SquaresIcon } from "~/components/icons/Squares"
import { XCharIcon } from "~/components/icons/XChar"
import { XFeedIcon } from "~/components/icons/XFeed"
import { XShopIcon } from "~/components/icons/XShop"
import { XSyncIcon } from "~/components/icons/XSync"
import { XLogIcon } from "~/components/icons/XLog"
import { Tooltip } from "~/components/Tooltip"

export const AppSwitcher = () => {
  return (
    <div className="relative">
      <div className="group">
        <SquaresIcon className="w-8 h-8 text-zinc-600 fill-current cursor-pointer" />
        <div className="group-hover:block hidden absolute top-full -right-6 pt-3">
          <div className="bg-white rounded-xl ring-1 ring-zinc-100 shadow-md p-2">
            <ul className="flex space-x-2 text-center text-zinc-600 text-sm">
              <li>
                <a
                  href="https://xchar.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center sm:px-4 px-2 sm:py-2 py-1 hover:bg-zinc-100 rounded-lg"
                >
                  <XCharIcon className="w-8 h-8 inline-block" />
                  <span>xChar</span>
                </a>
              </li>
              <li>
                <a
                  href="https://crossbell.io/feed"
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center sm:px-4 px-2 sm:py-2 py-1 hover:bg-zinc-100 rounded-lg"
                >
                  <XFeedIcon className="w-8 h-8 inline-block" />
                  <span>xFeed</span>
                </a>
              </li>
              <li>
                <a
                  href="https://xsync.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center sm:px-4 px-2 sm:py-2 py-1 hover:bg-zinc-100 rounded-lg"
                >
                  <XSyncIcon className="w-8 h-8 inline-block" />
                  <span>xSync</span>
                </a>
              </li>
              <li>
                <Tooltip label="Coming soon" placement="bottom">
                  <div className="flex flex-col items-center sm:px-4 px-2 sm:py-2 py-1 hover:bg-zinc-100 rounded-lg relative">
                    <XShopIcon className="w-8 h-8 inline-block" />
                    <span>xShop</span>
                  </div>
                </Tooltip>
              </li>
            </ul>
            <hr className="my-2 -mx-2" />
            <ul className="flex space-x-2 text-center text-zinc-600 text-sm">
              <li>
                <a
                  href="https://xlog.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center sm:px-4 px-2 sm:py-2 py-1 hover:bg-zinc-100 rounded-lg"
                >
                  <XLogIcon className="w-8 h-8 inline-block" />
                  <span>xLog</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
