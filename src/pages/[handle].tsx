import {
  useGetCharacter,
  useGetFollowers,
  useGetFollowings,
  useGetNotes,
  useGetAchievement,
  useGetSync,
} from "../queries/character"
import { useAccount } from "wagmi"
import { useRouter } from "next/router"
import { HeatMap } from "../components/HeatMap"
import { Image } from "~/components/ui/Image"
import Tilt from "react-parallax-tilt"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import relativeTime from "dayjs/plugin/relativeTime"
import { Avatar } from "~/components/ui/Avatar"
import { UniLink } from "~/components/ui/UniLink"

dayjs.extend(duration)
dayjs.extend(relativeTime)

export default function HandlePage() {
  const router = useRouter()
  const handle = router.query.handle as string
  const character = useGetCharacter(handle)
  const followers = useGetFollowers(character.data?.characterId || 0)
  const followings = useGetFollowings(character.data?.characterId || 0)
  const notes = useGetNotes(character.data?.characterId || 0)
  const achievement = useGetAchievement(character.data?.characterId || 0)
  const sync = useGetSync(character.data?.characterId || 0)

  const sourceList: {
    [key: string]: number
  } = {}
  notes.data?.list.map((note) => {
    if (note.metadata?.content?.sources) {
      note.metadata.content.sources.map((source) => {
        if (!sourceList[source]) {
          sourceList[source] = 0
        }
        sourceList[source]++
      })
    }
  })

  const syncMap: {
    [key: string]: {
      name: string
      icon: string
      url: string
    }
  } = {
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
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen py-20">
      <div className="fixed left-1/2 -translate-x-1/2 top-16">
        <svg width="1000" height="272" viewBox="0 0 125 34" fill="none">
          <g clip-path="url(#clip0_:Rql8rm:)">
            <line
              x1="4"
              y1="17.75"
              x2="125"
              y2="17.75"
              stroke="url(#liner_gradient_:Rql8rm:)"
              stroke-width="4.5"
            ></line>
            <path
              d="M19.669 23.78C18.6797 24.9747 17.513 25.8893 16.169 26.524C14.825 27.14 13.3223 27.448 11.661 27.448C10.1677 27.448 8.777 27.1773 7.489 26.636C6.21967 26.0947 5.11833 25.3573 4.185 24.424C3.25167 23.4907 2.51433 22.3893 1.973 21.12C1.43167 19.832 1.161 18.4507 1.161 16.976C1.161 15.5013 1.43167 14.1293 1.973 12.86C2.51433 11.572 3.25167 10.4613 4.185 9.528C5.11833 8.59467 6.21967 7.85733 7.489 7.316C8.777 6.77467 10.1677 6.504 11.661 6.504C13.2663 6.504 14.6757 6.784 15.889 7.344C17.121 7.904 18.213 8.716 19.165 9.78L16.505 12.356C15.9077 11.6653 15.217 11.1147 14.433 10.704C13.6677 10.2933 12.753 10.088 11.689 10.088C10.7557 10.088 9.87833 10.256 9.057 10.592C8.23567 10.9093 7.517 11.3667 6.901 11.964C6.30367 12.5613 5.82767 13.2893 5.473 14.148C5.11833 14.988 4.941 15.9307 4.941 16.976C4.941 18.0213 5.11833 18.9733 5.473 19.832C5.82767 20.672 6.30367 21.3907 6.901 21.988C7.517 22.5853 8.23567 23.052 9.057 23.388C9.87833 23.7053 10.7557 23.864 11.689 23.864C12.809 23.864 13.7983 23.64 14.657 23.192C15.5343 22.7253 16.309 22.072 16.981 21.232L19.669 23.78ZM21.9821 13.28H25.4261V15.184H25.6501C25.8181 14.848 26.0421 14.54 26.3221 14.26C26.6021 13.98 26.9101 13.7373 27.2461 13.532C27.6007 13.3267 27.9741 13.168 28.3661 13.056C28.7767 12.944 29.1781 12.888 29.5701 12.888C30.0554 12.888 30.4661 12.9347 30.8021 13.028C31.1567 13.1213 31.4554 13.2427 31.6981 13.392L30.7181 16.724C30.4941 16.612 30.2421 16.528 29.9621 16.472C29.7007 16.3973 29.3741 16.36 28.9821 16.36C28.4781 16.36 28.0207 16.4627 27.6101 16.668C27.1994 16.8547 26.8447 17.1253 26.5461 17.48C26.2661 17.8347 26.0421 18.2547 25.8741 18.74C25.7247 19.2067 25.6501 19.72 25.6501 20.28V27H21.9821V13.28ZM39.0328 12.832C40.0968 12.832 41.0674 13.0187 41.9448 13.392C42.8408 13.7467 43.6061 14.2507 44.2408 14.904C44.8941 15.5387 45.3981 16.304 45.7527 17.2C46.1261 18.096 46.3128 19.076 46.3128 20.14C46.3128 21.204 46.1261 22.184 45.7527 23.08C45.3981 23.976 44.8941 24.7507 44.2408 25.404C43.6061 26.0387 42.8408 26.5427 41.9448 26.916C41.0674 27.2707 40.0968 27.448 39.0328 27.448C37.9688 27.448 36.9888 27.2707 36.0928 26.916C35.2154 26.5427 34.4501 26.0387 33.7968 25.404C33.1621 24.7507 32.6581 23.976 32.2848 23.08C31.9301 22.184 31.7528 21.204 31.7528 20.14C31.7528 19.076 31.9301 18.096 32.2848 17.2C32.6581 16.304 33.1621 15.5387 33.7968 14.904C34.4501 14.2507 35.2154 13.7467 36.0928 13.392C36.9888 13.0187 37.9688 12.832 39.0328 12.832ZM39.0328 24.06C39.4994 24.06 39.9474 23.976 40.3768 23.808C40.8248 23.6213 41.2168 23.36 41.5528 23.024C41.8888 22.688 42.1501 22.2773 42.3368 21.792C42.5421 21.3067 42.6448 20.756 42.6448 20.14C42.6448 19.524 42.5421 18.9733 42.3368 18.488C42.1501 18.0027 41.8888 17.592 41.5528 17.256C41.2168 16.92 40.8248 16.668 40.3768 16.5C39.9474 16.3133 39.4994 16.22 39.0328 16.22C38.5474 16.22 38.0901 16.3133 37.6608 16.5C37.2314 16.668 36.8488 16.92 36.5128 17.256C36.1768 17.592 35.9061 18.0027 35.7008 18.488C35.5141 18.9733 35.4208 19.524 35.4208 20.14C35.4208 20.756 35.5141 21.3067 35.7008 21.792C35.9061 22.2773 36.1768 22.688 36.5128 23.024C36.8488 23.36 37.2314 23.6213 37.6608 23.808C38.0901 23.976 38.5474 24.06 39.0328 24.06ZM53.9648 27.448C53.0688 27.448 52.2662 27.336 51.5568 27.112C50.8662 26.888 50.2595 26.5987 49.7368 26.244C49.2328 25.8707 48.8035 25.4507 48.4488 24.984C48.0942 24.4987 47.8235 24.0133 47.6368 23.528L50.9128 22.128C51.2302 22.8373 51.6502 23.3693 52.1728 23.724C52.7142 24.06 53.3115 24.228 53.9648 24.228C54.6368 24.228 55.1688 24.1067 55.5608 23.864C55.9528 23.6213 56.1488 23.332 56.1488 22.996C56.1488 22.6227 55.9808 22.324 55.6448 22.1C55.3275 21.8573 54.7675 21.6427 53.9648 21.456L52.0328 21.036C51.6035 20.9427 51.1555 20.7933 50.6888 20.588C50.2408 20.3827 49.8302 20.1213 49.4568 19.804C49.0835 19.4867 48.7755 19.104 48.5328 18.656C48.2902 18.208 48.1688 17.6853 48.1688 17.088C48.1688 16.416 48.3088 15.8187 48.5888 15.296C48.8875 14.7733 49.2888 14.3347 49.7928 13.98C50.2968 13.6067 50.8848 13.3267 51.5568 13.14C52.2475 12.9347 52.9848 12.832 53.7688 12.832C55.0755 12.832 56.2422 13.0933 57.2688 13.616C58.2955 14.12 59.0515 14.932 59.5368 16.052L56.3728 17.34C56.1115 16.7987 55.7288 16.4067 55.2248 16.164C54.7208 15.9213 54.2168 15.8 53.7128 15.8C53.1902 15.8 52.7328 15.912 52.3408 16.136C51.9488 16.3413 51.7528 16.612 51.7528 16.948C51.7528 17.2653 51.9115 17.5173 52.2288 17.704C52.5648 17.8907 53.0128 18.0587 53.5728 18.208L55.6728 18.712C57.0728 19.048 58.1088 19.5893 58.7808 20.336C59.4715 21.064 59.8168 21.932 59.8168 22.94C59.8168 23.5373 59.6768 24.1067 59.3968 24.648C59.1168 25.1893 58.7155 25.6747 58.1928 26.104C57.6888 26.5147 57.0728 26.8413 56.3448 27.084C55.6355 27.3267 54.8422 27.448 53.9648 27.448ZM67.5 27.448C66.604 27.448 65.8013 27.336 65.092 27.112C64.4013 26.888 63.7947 26.5987 63.272 26.244C62.768 25.8707 62.3387 25.4507 61.984 24.984C61.6293 24.4987 61.3587 24.0133 61.172 23.528L64.448 22.128C64.7653 22.8373 65.1853 23.3693 65.708 23.724C66.2493 24.06 66.8467 24.228 67.5 24.228C68.172 24.228 68.704 24.1067 69.096 23.864C69.488 23.6213 69.684 23.332 69.684 22.996C69.684 22.6227 69.516 22.324 69.18 22.1C68.8627 21.8573 68.3027 21.6427 67.5 21.456L65.568 21.036C65.1387 20.9427 64.6907 20.7933 64.224 20.588C63.776 20.3827 63.3653 20.1213 62.992 19.804C62.6187 19.4867 62.3107 19.104 62.068 18.656C61.8253 18.208 61.704 17.6853 61.704 17.088C61.704 16.416 61.844 15.8187 62.124 15.296C62.4227 14.7733 62.824 14.3347 63.328 13.98C63.832 13.6067 64.42 13.3267 65.092 13.14C65.7827 12.9347 66.52 12.832 67.304 12.832C68.6107 12.832 69.7773 13.0933 70.804 13.616C71.8307 14.12 72.5867 14.932 73.072 16.052L69.908 17.34C69.6467 16.7987 69.264 16.4067 68.76 16.164C68.256 15.9213 67.752 15.8 67.248 15.8C66.7253 15.8 66.268 15.912 65.876 16.136C65.484 16.3413 65.288 16.612 65.288 16.948C65.288 17.2653 65.4467 17.5173 65.764 17.704C66.1 17.8907 66.548 18.0587 67.108 18.208L69.208 18.712C70.608 19.048 71.644 19.5893 72.316 20.336C73.0067 21.064 73.352 21.932 73.352 22.94C73.352 23.5373 73.212 24.1067 72.932 24.648C72.652 25.1893 72.2507 25.6747 71.728 26.104C71.224 26.5147 70.608 26.8413 69.88 27.084C69.1707 27.3267 68.3773 27.448 67.5 27.448ZM75.6032 6.952H79.2712V12.972L79.0472 14.932H79.2712C79.6072 14.3533 80.1298 13.8587 80.8392 13.448C81.5485 13.0373 82.4258 12.832 83.4712 12.832C84.3485 12.832 85.1792 13.0187 85.9632 13.392C86.7658 13.7467 87.4658 14.2507 88.0632 14.904C88.6792 15.5387 89.1645 16.304 89.5192 17.2C89.8738 18.096 90.0512 19.076 90.0512 20.14C90.0512 21.204 89.8738 22.184 89.5192 23.08C89.1645 23.976 88.6792 24.7507 88.0632 25.404C87.4658 26.0387 86.7658 26.5427 85.9632 26.916C85.1792 27.2707 84.3485 27.448 83.4712 27.448C82.4258 27.448 81.5485 27.2427 80.8392 26.832C80.1298 26.4213 79.6072 25.9267 79.2712 25.348H79.0472V27H75.6032V6.952ZM82.7152 24.06C83.2005 24.06 83.6578 23.9667 84.0872 23.78C84.5352 23.5933 84.9272 23.332 85.2632 22.996C85.5992 22.66 85.8698 22.2493 86.0752 21.764C86.2805 21.2787 86.3832 20.7373 86.3832 20.14C86.3832 19.5427 86.2805 19.0013 86.0752 18.516C85.8698 18.0307 85.5992 17.62 85.2632 17.284C84.9272 16.948 84.5352 16.6867 84.0872 16.5C83.6578 16.3133 83.2005 16.22 82.7152 16.22C82.2298 16.22 81.7632 16.3133 81.3152 16.5C80.8858 16.668 80.5032 16.92 80.1672 17.256C79.8312 17.592 79.5605 18.0027 79.3552 18.488C79.1498 18.9733 79.0472 19.524 79.0472 20.14C79.0472 20.756 79.1498 21.3067 79.3552 21.792C79.5605 22.2773 79.8312 22.688 80.1672 23.024C80.5032 23.36 80.8858 23.6213 81.3152 23.808C81.7632 23.976 82.2298 24.06 82.7152 24.06ZM105.384 23.696C104.75 24.816 103.891 25.7213 102.808 26.412C101.744 27.1027 100.438 27.448 98.8882 27.448C97.8429 27.448 96.8722 27.2707 95.9762 26.916C95.0989 26.5427 94.3336 26.0293 93.6802 25.376C93.0269 24.7227 92.5136 23.9573 92.1402 23.08C91.7856 22.184 91.6082 21.204 91.6082 20.14C91.6082 19.1507 91.7856 18.2173 92.1402 17.34C92.4949 16.444 92.9896 15.6693 93.6242 15.016C94.2589 14.344 95.0056 13.812 95.8642 13.42C96.7416 13.028 97.7029 12.832 98.7482 12.832C99.8496 12.832 100.83 13.0187 101.688 13.392C102.547 13.7467 103.266 14.2507 103.844 14.904C104.423 15.5387 104.862 16.2947 105.16 17.172C105.459 18.0493 105.608 19.0013 105.608 20.028C105.608 20.1587 105.608 20.2707 105.608 20.364C105.59 20.476 105.58 20.5787 105.58 20.672C105.562 20.7653 105.552 20.868 105.552 20.98H95.2202C95.2949 21.54 95.4442 22.0253 95.6682 22.436C95.9109 22.828 96.2002 23.164 96.5362 23.444C96.8909 23.7053 97.2736 23.9013 97.6842 24.032C98.0949 24.144 98.5149 24.2 98.9442 24.2C99.7842 24.2 100.475 24.0133 101.016 23.64C101.576 23.248 102.015 22.7627 102.332 22.184L105.384 23.696ZM102.052 18.376C102.034 18.1333 101.95 17.8627 101.8 17.564C101.67 17.2653 101.464 16.9853 101.184 16.724C100.923 16.4627 100.587 16.248 100.176 16.08C99.7842 15.912 99.3082 15.828 98.7482 15.828C97.9642 15.828 97.2736 16.052 96.6762 16.5C96.0789 16.948 95.6589 17.5733 95.4162 18.376H102.052ZM107.951 27V6.952H111.619V27H107.951ZM114.759 27V6.952H118.427V27H114.759Z"
              fill="currentColor"
            ></path>
          </g>
          <defs>
            <linearGradient
              id="liner_gradient_:Rql8rm:"
              x1="4"
              y1="21.0001"
              x2="125"
              y2="21.0001"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#F6C549"></stop>
              <stop offset="0.234375" stop-color="#E65040"></stop>
              <stop offset="0.505208" stop-color="#9688F2"></stop>
              <stop offset="0.760417" stop-color="#5B89F7"></stop>
              <stop offset="1" stop-color="#6AD991"></stop>
            </linearGradient>
            <clipPath id="clip0_:Rql8rm:">
              <rect width="125" height="34" fill="currentColor"></rect>
            </clipPath>
          </defs>
        </svg>
      </div>
      <Tilt
        className="w-[800px] mx-auto relative p-8 rounded-3xl text-gray-600 border-2 border-gray-50 overflow-hidden backdrop-blur-md"
        glareEnable={true}
        glareMaxOpacity={0.2}
        glareColor="#fff"
        glarePosition="all"
        glareBorderRadius="12px"
        tiltMaxAngleX={5}
        tiltMaxAngleY={5}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white to-gray-200 opacity-80"></div>
        <div className="flex relative">
          <div className="absolute right-0 top-0 bg-blue-400 text-white px-12 py-1 rounded-2xl cursor-pointer">
            Follow
          </div>
          <div className="w-32 text-center mr-4 flex flex-col items-center justify-between">
            {character.data?.metadata?.content?.avatars && (
              <Avatar
                className="rounded-full inline-block"
                name={handle}
                images={character.data?.metadata?.content?.avatars}
                size={80}
              />
            )}
            <div className="mt-2 font-bold text-2xl">
              No.{character.data?.characterId}
            </div>
            <div className="mt-2">
              <div className="text-xs">
                Blockchain Address
                <br />
                <UniLink
                  href={`https://scan.crossbell.io/address/${character.data?.owner}`}
                >
                  {character.data?.owner.slice(0, 5)}...
                  {character.data?.owner.slice(-4)}
                </UniLink>
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-2xl">
              <span>{character.data?.metadata?.content?.name}</span>
              <span className="text-base ml-2">@{handle}</span>
            </p>
            <p className="truncate text-sm mt-1">
              {character.data?.metadata?.content?.bio}
            </p>
            <div className="space-x-5 mt-2">
              <UniLink href={`https://crossbell.io/@${handle}/followers`}>
                {followers.data?.count} Followers
              </UniLink>
              <UniLink href={`https://crossbell.io/@${handle}/following`}>
                {followings.data?.count} Following
              </UniLink>
              <span>{notes.data?.count} Notes</span>
            </div>
            <div className="text-gray-500 mt-2 text-sm">
              <UniLink
                href={`https://scan.crossbell.io/tx/${character.data?.transactionHash}`}
              >
                Joined{" "}
                {dayjs
                  .duration(
                    dayjs(character?.data?.createdAt).diff(dayjs(), "minute"),
                    "minute",
                  )
                  .humanize()}{" "}
                ago
              </UniLink>
            </div>
            <div className="mt-3 text-[0px]">
              {achievement.data?.list[0]?.groups?.map((group) => {
                const achievement = group.items[group.items.length - 1].info
                return (
                  <span className="mr-4 inline-flex" key={achievement.tokenId}>
                    <span className="inline-block w-10 h-10 mr-2">
                      <Image
                        width={40}
                        height={40}
                        alt="achievement"
                        src={achievement.media}
                      />
                    </span>
                    <span className="inline-flex flex-col justify-around">
                      <span className="capitalize text-sm">
                        {group.info.title}
                      </span>
                      <span className="text-xs">
                        {
                          achievement.attributes.find(
                            (attribute) => attribute.trait_type === "tier",
                          )?.value
                        }
                      </span>
                    </span>
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      </Tilt>
      <div className="w-[800px] text-sm mt-8 relative rounded-3xl text-gray-700 border-2 border-gray-100 overflow-hidden backdrop-blur-md py-6 px-8">
        <div className="font-medium text-base mb-4">
          <span className="align-middle">
            I am owning these social contents on Crossbell
          </span>
          <UniLink
            href="https://crossbell.io/sync"
            className="align-middle ml-2 inline-flex justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-4 h-4 inline-block"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
              />
            </svg>
          </UniLink>
        </div>
        <div className="mb-4">
          {sourceList.xlog && (
            <UniLink
              className="mr-6 inline-flex"
              href={syncMap["xlog"].url.replace("{username}", handle)}
            >
              <Image
                className="rounded-full w-9 h-9 inline-block mr-2"
                src={syncMap["xlog"].icon}
                alt="xLog"
              />
              <span className="inline-flex flex-col justify-around">
                <span className="text-sm">{syncMap["xlog"].name}</span>
                <span className="text-xs">@{handle}</span>
              </span>
            </UniLink>
          )}
          {sync.data?.data?.result?.map((item: any) => {
            return (
              <UniLink
                className="mr-6 inline-flex"
                key={item.platform}
                href={syncMap[item.platform].url.replace(
                  "{username}",
                  item.username,
                )}
              >
                <Image
                  className="rounded-full w-9 h-9 inline-block mr-2"
                  src={syncMap[item.platform].icon}
                  alt={item.platform}
                />
                <span className="inline-flex flex-col justify-around">
                  <span className="text-sm">{syncMap[item.platform].name}</span>
                  <span className="text-xs">@{item.username}</span>
                </span>
              </UniLink>
            )
          })}
        </div>
        <HeatMap characterId={character.data?.characterId} />
        {/* <div className="text-xs mt-4 leading-snug">{Object.keys(sourceList).sort((a, b) => sourceList[b] - sourceList[a]).map((source) => {
          return <span className="bg-gray-200 rounded-3xl px-2 inline-block mt-1 mr-1" key={source}>{source + " " + sourceList[source]}</span>
        })}</div> */}
      </div>
      <div className="w-[800px] text-sm mt-8 relative rounded-3xl text-gray-700 border-2 border-gray-100 overflow-hidden backdrop-blur-md py-6 px-8">
        <div className="absolute top-0 left-0 w-full h-full bg-white opacity-70"></div>
        <div className="font-medium text-base relative">
          My on-chain social contents
        </div>
        {notes.data?.list.map((note) => {
          return (
            <div
              key={note.noteId}
              className="mx-auto relative py-6 space-y-2 overflow-hidden"
            >
              <UniLink
                href={
                  note.metadata?.content?.sources?.includes("xlog") &&
                  note.metadata?.content?.external_urls?.[0]
                    ? note.metadata?.content?.external_urls?.[0]
                    : `https://crossbell.io/notes/${note.characterId}-${note.noteId}`
                }
              >
                <div className="text-gray-400 relative">
                  {dayjs
                    .duration(
                      dayjs(note.updatedAt).diff(dayjs(), "minute"),
                      "minute",
                    )
                    .humanize()}{" "}
                  ago
                </div>
                {note.metadata?.content?.title && (
                  <div className="line-clamp-1 font-medium text-lg my-2">
                    {note.metadata?.content?.title}
                  </div>
                )}
                <div className="line-clamp-3 relative">
                  {note.metadata?.content?.content}
                </div>
              </UniLink>
              <div className="flex justify-between items-center">
                <div className="text-xs relative">
                  {note.metadata?.content?.external_urls?.[0] && (
                    <UniLink href={note.metadata?.content?.external_urls?.[0]}>
                      {note.metadata?.content?.sources?.map((source) => (
                        <span
                          className="bg-gray-300 rounded-3xl px-2 inline-block mt-1 mr-1"
                          key={source}
                        >
                          {source}
                        </span>
                      ))}
                    </UniLink>
                  )}
                  {!note.metadata?.content?.external_urls?.[0] &&
                    note.metadata?.content?.sources?.map((source) => (
                      <span
                        className="bg-gray-300 rounded-3xl px-2 inline-block mt-1 mr-1"
                        key={source}
                      >
                        {source}
                      </span>
                    ))}
                </div>
                <div className="mr-1 text-gray-400 relative">
                  <UniLink
                    href={`https://scan.crossbell.io/tx/${note.updatedTransactionHash}`}
                  >
                    #{note.noteId} {note.updatedTransactionHash.slice(0, 5)}...
                    {note.updatedTransactionHash.slice(-4)}
                  </UniLink>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
