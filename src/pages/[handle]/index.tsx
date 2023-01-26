import {
  useGetCharacter,
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
import { useRouter } from "next/router"
import { HeatMap } from "~/components/HeatMap"
import { dehydrate, QueryClient } from "@tanstack/react-query"
import { GetServerSideProps } from "next"
import { Platform } from "~/components/Platform"
import InfiniteScroll from "react-infinite-scroller"
import { AchievementItem } from "~/components/AchievementItem"
import { Box } from "~/components/ui/Box"
import { TreasureItem } from "~/components/TreasureItem"
import { Link } from "react-scroll"
import { NoteItem } from "~/components/NoteItem"
import { CharacterCard } from "~/components/CharacterCard"

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
  const notes = useGetNotes({
    characterId: character.data?.characterId || 0,
    limit: 10,
  })
  const achievement = useGetAchievements(character.data?.characterId || 0)
  const latestMintedNotes = useGetLatestMintedNotes(character?.data?.owner)

  const tabs = [
    {
      title: "Social Platforms",
      icon: "🪐",
    },
    {
      title: "Achievements",
      icon: "✨",
      details: `${handle}/achievements`,
    },
    {
      title: "Collections",
      icon: "💎",
    },
    {
      title: "Notes",
      icon: "🎼",
    },
  ]

  return (
    <div className="relative flex flex-col items-center min-h-screen py-20">
      <div className="w-full sm:w-auto relative">
        <div className="absolute right-full top-56 bottom-0 pr-8">
          <div className="sticky top-14 whitespace-nowrap text-left space-y-3 text-zinc-500 text-xl">
            {tabs.map((tab) => (
              <Link
                activeClass="text-accent"
                className="cursor-pointer hover:text-accent flex-1 flex items-center space-x-2 transition-colors"
                to={`${tab.icon} ${tab.title}`}
                spy={true}
                smooth={true}
                duration={500}
                key={tab.title}
              >
                <span>{tab.icon}</span>
                <span className="text-base">{tab.title}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="space-y-5">
          <CharacterCard />
          <Box title={`${tabs[0].icon} ${tabs[0].title}`}>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-x-2 gap-y-3">
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
          <Box
            title={`${tabs[1].icon} ${tabs[1].title}`}
            details={tabs[1].details}
          >
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-x-2 gap-y-5">
              {achievement.data?.list?.map((series) =>
                series.groups?.map((group) => (
                  <AchievementItem
                    group={group}
                    key={group.info.name}
                    layoutId="index"
                    character={character.data}
                  />
                )),
              )}
            </div>
          </Box>
          <Box title={`${tabs[2].icon} ${tabs[2].title}`}>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-x-2 gap-y-5">
              {latestMintedNotes.data?.list?.map((note) => (
                <TreasureItem
                  note={note}
                  key={note.noteCharacterId + "-" + note.noteId}
                />
              ))}
            </div>
          </Box>
          <Box title={`${tabs[3].icon} ${tabs[3].title}`}>
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
                      page?.list.map((note) => (
                        <NoteItem note={note} key={note.noteId} />
                      )),
                    )}
                </InfiniteScroll>
              </div>
            </>
          </Box>
        </div>
      </div>
    </div>
  )
}
