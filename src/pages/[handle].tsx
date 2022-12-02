import {
  useGetCharacter,
  useGetFollowers,
  useGetFollowings,
  useGetPagesBySiteLite,
  useGetAchievements,
} from "../queries/character"
import {
  fetchGetCharacter,
  prefetchGetFollowers,
  prefetchGetFollowings,
  prefetchGetNotes,
  prefetchGetAchievements,
  prefetchGetCalendar,
} from "../queries/character.server"
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
import { ChevronRightIcon } from "@heroicons/react/24/outline"
import { dehydrate, QueryClient } from "@tanstack/react-query"
import { GetServerSideProps } from "next"
import Head from "next/head"
import { toGateway } from "~/lib/ipfs-parser"
import { Platform } from "~/components/Platform"

dayjs.extend(duration)
dayjs.extend(relativeTime)

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const queryClient = new QueryClient()

  const character = await fetchGetCharacter(
    ctx.params!.handle as string,
    queryClient,
  )
  await Promise.all([
    prefetchGetFollowers(character.characterId, queryClient),
    prefetchGetFollowings(character.characterId, queryClient),
    prefetchGetNotes(
      {
        characterId: character.characterId,
        limit: 20,
      },
      queryClient,
    ),
    prefetchGetAchievements(character.characterId, queryClient),
    prefetchGetCalendar(character.characterId, queryClient),
  ])

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

export default function HandlePage() {
  const router = useRouter()
  const handle = router.query.handle as string
  const character = useGetCharacter(handle)
  const followers = useGetFollowers(character.data?.characterId || 0)
  const followings = useGetFollowings(character.data?.characterId || 0)
  const notes = useGetPagesBySiteLite({
    characterId: character.data?.characterId || 0,
    limit: 20,
  })
  const achievement = useGetAchievements(character.data?.characterId || 0)

  const sourceList: {
    [key: string]: number
  } = {}
  notes.data?.pages?.[0]?.list.map((note) => {
    if (note.metadata?.content?.sources) {
      note.metadata.content.sources.map((source) => {
        if (!sourceList[source]) {
          sourceList[source] = 0
        }
        sourceList[source]++
      })
    }
  })

  return (
    <div className="relative flex flex-col items-center min-h-screen py-20">
      <Head>
        <title>
          {character.data?.metadata?.content?.name || character.data?.handle}
        </title>
        <meta
          name="description"
          content={character.data?.metadata?.content?.bio}
        />
        <link
          rel="icon"
          href={toGateway(
            character.data?.metadata?.content?.avatars?.[0] || "/favicon.ico",
          )}
        />
      </Head>
      <div className="fixed left-1/2 -translate-x-1/2 top-14 w-[1000px] h-[272px]">
        <Image
          alt="xChar"
          src="/logos/crossbell.svg"
          width={1000}
          height={272}
          priority
        />
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
                <strong>{followers.data?.count}</strong> Followers
              </UniLink>
              <UniLink href={`https://crossbell.io/@${handle}/following`}>
                <strong>{followings.data?.count}</strong> Following
              </UniLink>
              <span>
                <strong>{notes.data?.pages?.[0]?.count}</strong> Notes
              </span>
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
          </div>
        </div>
      </Tilt>
      <div className="w-[800px] text-sm mt-8 relative rounded-3xl text-gray-700 border-2 border-gray-100 overflow-hidden backdrop-blur-md py-6 px-8">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br bg-white opacity-80"></div>
        <div className="relative font-medium text-xl mb-4">✨ Achievements</div>
        <div className="relative">
          <div className="overflow-x-scroll">
            <div className="space-x-5 whitespace-nowrap mr-10 w-fit">
              {achievement.data?.list?.map((series) =>
                series.groups?.map((group) => {
                  const achievement = group.items[group.items.length - 1].info
                  return (
                    <span className="inline-flex" key={achievement.tokenId}>
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
                }),
              )}
            </div>
          </div>
          <UniLink
            href={`${handle}/achievements`}
            className="absolute right-0 top-0 bottom-0 flex items-center bg-gradient-to-r from-transparent via-white to-white w-10 justify-end cursor-pointer"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </UniLink>
        </div>
      </div>
      <div className="w-[800px] text-sm mt-8 relative rounded-3xl text-gray-700 border-2 border-gray-100 overflow-hidden backdrop-blur-md py-6 px-8">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br bg-white opacity-80"></div>
        <div className="relative font-medium text-xl mb-4">
          🪐 Social Platforms
        </div>
        <div className="relative mt-4 grid grid-cols-6 gap-4">
          {sourceList.xlog && <Platform platform="xlog" username={handle} />}
          {character.data?.metadata?.content?.connected_accounts?.map(
            (connected_account) => {
              const match = connected_account.match(/csb:\/\/account:(.*)@(.*)/)
              if (!match) {
                return null
              }
              const username = match[1]
              const platform = match[2]
              return (
                <Platform
                  key={platform}
                  platform={platform}
                  username={username}
                />
              )
            },
          )}
        </div>
      </div>
      <div className="w-[800px] text-sm mt-8 relative rounded-3xl text-gray-700 border-2 border-gray-100 overflow-hidden backdrop-blur-md py-6 px-8">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br bg-white opacity-80"></div>
        <div className="relative font-medium text-xl mb-4">
          <span className="align-middle">🎼 Notes</span>
        </div>
        <div className="relative flex justify-center w-full">
          <HeatMap characterId={character.data?.characterId} />
        </div>
        <div className="relative text-xs mt-4 leading-snug">
          {Object.keys(sourceList)
            .sort((a, b) => sourceList[b] - sourceList[a])
            .map((source) => {
              return (
                <span
                  className="bg-gray-200 rounded-3xl px-2 inline-block mt-1 mr-1"
                  key={source}
                >
                  {source + " " + sourceList[source]}
                </span>
              )
            })}
        </div>
        {!!notes.data?.pages?.[0]?.count &&
          notes.data?.pages?.map((page) =>
            page?.list.map((note) => {
              return (
                <div
                  key={note.noteId}
                  className="mx-auto relative py-6 space-y-2 overflow-hidden border-b border-dashed"
                >
                  <UniLink
                    href={
                      note.metadata?.content?.sources?.includes("xlog") &&
                      note.metadata?.content?.external_urls?.[0]
                        ? note.metadata?.content?.external_urls?.[0]
                        : `https://crossbell.io/notes/${note.characterId}-${note.noteId}`
                    }
                  >
                    <div className="w-full">
                      <div className="text-gray-400 relative">
                        {dayjs
                          .duration(
                            dayjs(note.updatedAt).diff(dayjs(), "minute"),
                            "minute",
                          )
                          .humanize()}{" "}
                        ago
                      </div>
                      <div className="flex my-2">
                        {note.cover && (
                          <div className="xlog-post-cover flex items-center relative w-20 h-20 mr-4 mt-0">
                            <Image
                              className="object-cover rounded"
                              src={note.cover}
                              fill={true}
                              alt="cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          {note.metadata?.content?.title && (
                            <div className="line-clamp-1 font-medium text-lg">
                              {note.metadata?.content?.title}
                            </div>
                          )}
                          <div
                            className="line-clamp-3 relative my-2"
                            dangerouslySetInnerHTML={{
                              __html: note.metadata?.content?.summary || "",
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </UniLink>
                  <div className="flex justify-between items-center">
                    <div className="text-xs relative">
                      {note.metadata?.content?.external_urls?.[0] && (
                        <UniLink
                          href={note.metadata?.content?.external_urls?.[0]}
                        >
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
                        #{note.noteId} {note.updatedTransactionHash.slice(0, 5)}
                        ...
                        {note.updatedTransactionHash.slice(-4)}
                      </UniLink>
                    </div>
                  </div>
                </div>
              )
            }),
          )}
      </div>
    </div>
  )
}
