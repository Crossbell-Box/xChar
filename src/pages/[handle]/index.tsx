import {
  useGetCharacter,
  useGetFollowers,
  useGetFollowings,
  useGetNotes,
  useGetAchievements,
  useGetLatestMintedNotes,
} from "~/queries/character"
import {
  fetchGetCharacter,
  prefetchGetFollowers,
  prefetchGetFollowings,
  prefetchGetNotes,
  prefetchGetAchievements,
  prefetchGetCalendar,
} from "~/queries/character.server"
import { useAccount } from "wagmi"
import { useRouter } from "next/router"
import { HeatMap } from "~/components/HeatMap"
import { Image } from "~/components/ui/Image"
import Tilt from "react-parallax-tilt"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import relativeTime from "dayjs/plugin/relativeTime"
import { Avatar } from "~/components/ui/Avatar"
import { UniLink } from "~/components/ui/UniLink"
import { PencilSquareIcon, UserIcon } from "@heroicons/react/24/solid"
import { dehydrate, QueryClient } from "@tanstack/react-query"
import { GetServerSideProps } from "next"
import Head from "next/head"
import { toGateway } from "~/lib/ipfs-parser"
import { Platform } from "~/components/Platform"
import { Source } from "~/components/Source"
import { Button } from "~/components/ui/Button"
import { FollowingButton } from "~/components/FollowingButton"
import { useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroller"
import { Achievement } from "~/components/Achievement"
import { Box } from "~/components/ui/Box"
import { Note } from "~/lib/types"

dayjs.extend(duration)
dayjs.extend(relativeTime)

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const queryClient = new QueryClient()

  const character = await fetchGetCharacter(
    ctx.params!.handle as string,
    queryClient,
  )
  if (character?.characterId) {
    await Promise.all([
      prefetchGetFollowers(character.characterId, queryClient),
      prefetchGetFollowings(character.characterId, queryClient),
      prefetchGetNotes(
        {
          characterId: character.characterId,
          limit: 10,
        },
        queryClient,
      ),
      prefetchGetAchievements(character.characterId, queryClient),
      prefetchGetCalendar(character.characterId, queryClient),
    ])
  } else {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  }
}

export default function HandlePage() {
  const router = useRouter()
  const handle = router.query.handle as string
  const character = useGetCharacter(handle)
  const followers = useGetFollowers(character.data?.characterId || 0)
  const followings = useGetFollowings(character.data?.characterId || 0)
  const notes = useGetNotes({
    characterId: character.data?.characterId || 0,
    limit: 10,
  })
  const achievement = useGetAchievements(character.data?.characterId || 0)
  const latestMintedNotes = useGetLatestMintedNotes(character?.data?.owner)
  console.log(latestMintedNotes.data?.list)
  const { address } = useAccount()

  const [isOwner, setIsOwner] = useState(false)
  useEffect(() => {
    setIsOwner(!!(address && address.toLowerCase?.() === character.data?.owner))
  }, [address, character.data?.owner])

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
      <div className="fixed left-1/2 -translate-x-1/2 top-8 sm:w-[1000px] w-full h-[272px]">
        <Image
          alt="xChar"
          src="/logos/xchar.svg"
          width={1000}
          height={272}
          priority
        />
      </div>
      <div className="space-y-5 w-full sm:w-auto">
        <Tilt
          className="sm:w-[800px] w-full mx-auto relative p-8 sm:rounded-3xl text-gray-600 border-2 border-gray-50 overflow-hidden backdrop-blur-md"
          glareEnable={true}
          glareMaxOpacity={0.2}
          glareColor="#fff"
          glarePosition="all"
          glareBorderRadius="12px"
          tiltMaxAngleX={5}
          tiltMaxAngleY={5}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white to-gray-200 opacity-80"></div>
          <div className="flex relative flex-col sm:flex-row">
            <div className="absolute right-0 top-0">
              {isOwner ? (
                <UniLink href={`/${handle}/edit`}>
                  <Button
                    className="align-middle space-x-1"
                    aria-label="follow"
                    rounded="full"
                  >
                    <PencilSquareIcon className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </UniLink>
              ) : (
                <FollowingButton
                  className="rounded-full"
                  characterId={character.data?.characterId}
                />
              )}
            </div>
            <div className="sm:w-32 sm:text-center mr-4 flex flex-col sm:items-center justify-between">
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
            <div className="flex-1 min-w-0 mt-4 sm:mt-0">
              <p className="font-medium text-2xl">
                <span>{character.data?.metadata?.content?.name}</span>
                <span className="text-base ml-2 text-zinc-500">@{handle}</span>
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
        <Box title="🪐 Social Platforms">
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-x-2 gap-y-4">
            <Platform platform="xlog" username={handle} />
            {character.data?.metadata?.content?.connected_accounts?.map(
              (connected_account) => {
                const match = (
                  (connected_account as any).uri || connected_account
                )?.match?.(/csb:\/\/account:(.*)@(.*)/)
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
        </Box>
        <Box title="✨ Achievements">
          <div className="grid grid-cols-2 sm:grid-cols-8 gap-x-2 gap-y-5">
            {achievement.data?.list?.map((series) =>
              series.groups?.map((group) => (
                <Achievement group={group} key={group.info.name} />
              )),
            )}
          </div>
        </Box>
        <Box title="💎 Treasures">
          <div className="grid grid-cols-2 sm:grid-cols-8 gap-x-2 gap-y-5">
            {latestMintedNotes.data?.list?.map((note) => {
              return (
                <UniLink
                  key={note.noteCharacterId + "-" + note.noteId}
                  className="border h-0 pt-[100%] rounded-md relative"
                  href={
                    note.note?.metadata?.content?.external_urls?.[0] &&
                    note.note?.metadata?.content?.external_urls?.[0] !==
                      "https://crossbell.io"
                      ? note.note?.metadata.content.external_urls[0]
                      : `https://crossbell.io/notes/${note.noteCharacterId}-${note.noteId}`
                  }
                >
                  <div className="absolute top-0 bottom-0 left-0 right-0 rounded-md overflow-hidden">
                    {(note.note as Note).cover ? (
                      <Image
                        alt={note.noteCharacterId + "-" + note.noteId}
                        src={(note.note as Note).cover!}
                        fill={true}
                        className="object-cover"
                      />
                    ) : (
                      <div className="text-[10px] leading-normal p-1 bg-slate-100 text-slate-500">
                        {(note.note as Note)?.metadata?.content?.summary}
                      </div>
                    )}
                    <div className="bg-gradient-to-t from-zinc-600 absolute bottom-0 top-0 left-0 right-0 font-medium flex flex-col justify-center px-1 pb-1">
                      <div className="text-white text-sm leading-tight line-clamp-2 overflow-hidden">
                        {note.note?.metadata?.content?.title ||
                          (note.note as Note)?.metadata?.content?.summary}
                      </div>
                      <div className="text-[10px] text-zinc-300 line-clamp-1 overflow-hidden absolute bottom-1 left-1 right-1">
                        <UserIcon className="w-[10px] h-[10px] inline mr-[2px] align-middle" />
                        <span className="align-middle">
                          {note.noteCharacter?.metadata?.content?.name ||
                            note.noteCharacter?.handle}
                        </span>
                      </div>
                    </div>
                  </div>
                </UniLink>
              )
            })}
          </div>
        </Box>
        <Box title="🎼 Notes">
          <>
            <div className="relative flex justify-center w-full">
              <HeatMap characterId={character.data?.characterId} />
            </div>
            {/* <div className="relative text-xs mt-4 leading-snug">
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
            </div> */}
            <div>
              <InfiniteScroll
                loadMore={notes.fetchNextPage as any}
                hasMore={notes.hasNextPage}
                loader={
                  <div
                    className="relative mt-4 w-full text-sm text-center py-4"
                    key={"loading"}
                  >
                    Loading ...
                  </div>
                }
              >
                {!!notes.data?.pages?.[0]?.count &&
                  notes.data?.pages?.map((page) =>
                    page?.list.map((note) => {
                      return (
                        <div
                          key={note.noteId}
                          className="mx-auto relative py-6 space-y-2 overflow-hidden border-b border-dashed last:border-b-0"
                        >
                          <UniLink
                            href={
                              note.metadata?.content?.external_urls?.[0] &&
                              note.metadata?.content?.external_urls?.[0] !==
                                "https://crossbell.io"
                                ? note.metadata.content.external_urls[0]
                                : `https://crossbell.io/notes/${note.characterId}-${note.noteId}`
                            }
                          >
                            <span className="w-full">
                              <span className="text-gray-400 relative">
                                {dayjs
                                  .duration(
                                    dayjs(note.updatedAt).diff(
                                      dayjs(),
                                      "minute",
                                    ),
                                    "minute",
                                  )
                                  .humanize()}{" "}
                                ago
                              </span>
                              <span className="flex my-2">
                                {note.cover && (
                                  <span className="flex items-center relative w-20 h-20 mr-4 mt-0">
                                    <Image
                                      className="object-cover rounded"
                                      src={note.cover}
                                      fill={true}
                                      alt="cover"
                                    />
                                  </span>
                                )}
                                <span className="flex-1 space-y-2">
                                  {note.metadata?.content?.title && (
                                    <span className="line-clamp-1 font-medium text-lg">
                                      {note.metadata?.content?.title}
                                    </span>
                                  )}
                                  <span className="line-clamp-3 relative overflow-hidden">
                                    {note.metadata?.content?.summary}
                                  </span>
                                </span>
                              </span>
                            </span>
                          </UniLink>
                          <div className="flex justify-between items-center">
                            <div className="text-xs relative">
                              {note.metadata?.content?.sources?.map(
                                (source) => (
                                  <Source key={source} name={source} />
                                ),
                              )}
                            </div>
                            <div className="mr-1 text-gray-400 relative">
                              <UniLink
                                href={`https://scan.crossbell.io/tx/${note.updatedTransactionHash}`}
                              >
                                #{note.noteId}{" "}
                                {note.updatedTransactionHash.slice(0, 5)}
                                ...
                                {note.updatedTransactionHash.slice(-4)}
                              </UniLink>
                            </div>
                          </div>
                        </div>
                      )
                    }),
                  )}
              </InfiniteScroll>
            </div>
          </>
        </Box>
      </div>
    </div>
  )
}
