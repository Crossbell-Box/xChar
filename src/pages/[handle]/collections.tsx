import { useGetCharacter, useGetMintedNotes } from "~/queries/character"
import {
  fetchGetCharacter,
  prefetchGetFollowers,
  prefetchGetFollowings,
  prefetchGetMintedNotes,
} from "~/queries/character.server"
import { useRouter } from "next/router"
import { UniLink } from "~/components/ui/UniLink"
import { dehydrate, QueryClient } from "@tanstack/react-query"
import { GetServerSideProps } from "next"
import { Box } from "~/components/ui/Box"
import { CharacterCard } from "~/components/CharacterCard"
import { ChevronLeftIcon } from "@heroicons/react/20/solid"
import { TreasureItem } from "~/components/TreasureItem"
import InfiniteScroll from "react-infinite-scroller"

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
      prefetchGetMintedNotes(
        {
          address: character.owner,
          limit: 15,
        },
        queryClient,
      ),
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

export default function CollectionsPage() {
  const router = useRouter()
  const handle = router.query.handle as string
  const character = useGetCharacter(handle)
  const notes = useGetMintedNotes({
    address: character.data?.owner,
    limit: 15,
  })

  const tabs = [
    {
      title: "Collections",
      icon: "💎",
    },
  ]

  return (
    <div className="relative flex flex-col items-center min-h-screen py-20">
      <div className="w-full sm:w-auto relative">
        <UniLink
          onClick={router.back}
          className="absolute right-full top-56 mr-20 flex items-center text-lg text-zinc-600 hover:text-accent transition-colors font-medium"
        >
          <ChevronLeftIcon className="inline w-5 h-5" />
          <span>Back</span>
        </UniLink>
        <div className="space-y-5">
          <CharacterCard />
          <Box
            title={`${tabs[0].icon} ${tabs[0].title}`}
            titleClassName="text-2xl"
          >
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
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-x-5 gap-y-5 mt-6">
                  {!!notes.data?.pages?.[0]?.count &&
                    notes.data?.pages?.map((page) =>
                      page?.list.map((note) => (
                        <TreasureItem
                          note={note}
                          key={note.noteCharacterId + "-" + note.noteId}
                          size="lg"
                        />
                      )),
                    )}
                </div>
              </InfiniteScroll>
            </div>
          </Box>
        </div>
      </div>
    </div>
  )
}
