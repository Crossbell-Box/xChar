import { UniLink } from "~/components/ui/UniLink"
import { random, mostReadable } from "@ctrl/tinycolor"
import { stringToInteger } from "~/lib/helpers"

const builtInSourceMap: {
  [key: string]: string[]
} = {
  ["crossbell.io"]: ["#E1BE60", "#000", "https://crossbell.io/feed"],
  xlog: ["#6466e9", "#fff", "https://xlog.app/"],
  operatorsync: ["#5298e9", "#fff", "https://crossbell.io/sync"],
  sync: ["#5298e9", "#fff", "https://crossbell.io/sync"],
  xsync: ["#5298e9", "#fff", "https://crossbell.io/sync"],
  crosssync: ["#5d87f7", "#fff", "https://crosssync.app/"],
  medium: ["#000000", "#fff", "https://medium.com/"],
  twitter: ["#4691dd", "#fff", "https://twitter.com/"],
  tiktok: ["#000000", "#fff", "https://www.tiktok.com/"],
  youtube: ["#ea3323", "#fff", "https://www.youtube.com/"],
  pinterest: ["#e60019", "#fff", "https://www.pinterest.com/"],
  substack: ["#ff6719", "#fff", "https://substack.com/"],
  pixiv: ["#3e97f3", "#fff", "https://www.pixiv.net/"],
  jike: ["#F8E026", "#000", "https://web.okjike.com/"],
  "telegram channel": ["#08c", "#fff", "https://telegram.org/"],
}

function getColorFromSource(name: string) {
  if (builtInSourceMap[name]) {
    return builtInSourceMap[name]
  }
  const bgColor = random({ seed: stringToInteger(name) }).toHexString()
  const textColor = mostReadable(bgColor, ["#000", "#fff"], {
    includeFallbackColors: true,
    size: "small",
  })?.toHexString()
  return [bgColor, textColor]
}

export const Source: React.FC<{
  name: string
}> = ({ name }) => {
  const buildIn = builtInSourceMap[name.toLowerCase()]
  const [bgColor, textColor] = getColorFromSource(name.toLowerCase())

  return (
    <UniLink className="inline-flex mt-2 mr-2 opacity-80" href={buildIn?.[2]}>
      <span
        className="bg-gray-300 rounded-3xl px-2 inline-block"
        style={{
          backgroundColor: bgColor,
          color: textColor,
        }}
      >
        {name}
      </span>
    </UniLink>
  )
}
