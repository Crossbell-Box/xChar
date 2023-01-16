import { Image } from "~/components/ui/Image"
import { UniLink } from "~/components/ui/UniLink"

const syncMap: {
  [key: string]: {
    name: string
    icon: string
    url: string
  }
} = {
  telegram: {
    name: "Telegram",
    icon: "/logos/telegram.svg",
    url: "https://t.me/{username}",
  },
  tg_channel: {
    name: "Telegram Channel",
    icon: "/logos/telegram.svg",
    url: "https://t.me/{username}",
  },
  twitter: {
    name: "Twitter",
    icon: "/logos/twitter.svg",
    url: "https://twitter.com/{username}",
  },
  twitter_id: {
    name: "Twitter",
    icon: "/logos/twitter.svg",
    url: "https://twitter.com/i/user/{username}",
  },
  pixiv: {
    name: "Pixiv",
    icon: "/logos/pixiv.svg",
    url: "https://www.pixiv.net/users/{username}",
  },
  substack: {
    name: "Substack",
    icon: "/logos/substack.svg",
    url: "https://{username}.substack.com/",
  },
  medium: {
    name: "Mediam",
    icon: "/logos/medium.svg",
    url: "https://medium.com/@{username}",
  },
  xlog: {
    name: "xLog",
    icon: "/logos/xlog.svg",
    url: "https://{username}.xlog.app/",
  },
  github: {
    name: "GitHub",
    icon: "/logos/github.svg",
    url: "https://github.com/{username}",
  },
  jike: {
    name: "Jike",
    icon: "/logos/jike.svg",
    url: "https://web.okjike.com/u/{username}",
  },
}

export const Platform: React.FC<{
  platform: string
  username: string
}> = ({ platform, username }) => {
  return (
    <UniLink
      className="inline-flex sm:hover:animate-bounce2"
      key={platform}
      href={syncMap[platform]?.url.replace("{username}", username)}
    >
      <span className="rounded-full w-9 h-9 inline-block mr-2 overflow-hidden">
        {syncMap[platform]?.icon ? (
          <Image
            width={36}
            height={36}
            src={syncMap[platform]?.icon}
            alt={platform}
          />
        ) : (
          <span className="w-9 h-9 bg-orange-200 inline-block"></span>
        )}
      </span>
      <span className="inline-flex flex-col justify-around flex-1 min-w-0">
        <span className="text-sm truncate">
          {syncMap[platform]?.name || platform}
        </span>
        <span className="text-xs truncate">@{username}</span>
      </span>
    </UniLink>
  )
}
