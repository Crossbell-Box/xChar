import { useGetCharacter, useGetAchievements } from "~/queries/character"
import {
  fetchGetCharacter,
  prefetchGetFollowers,
  prefetchGetFollowings,
  prefetchGetNotes,
  prefetchGetAchievements,
} from "~/queries/character.server"
import { useRouter } from "next/router"
import { UniLink } from "~/components/ui/UniLink"
import { dehydrate, QueryClient } from "@tanstack/react-query"
import { GetServerSideProps } from "next"
import { AchievementItem } from "~/components/AchievementItem"
import { Box } from "~/components/ui/Box"
import { CharacterCard } from "~/components/CharacterCard"
import { ChevronLeftIcon } from "@heroicons/react/20/solid"
import { useEffect, useState } from "react"
import { useAccount } from "wagmi"

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

export default function AchievementsPage() {
  const router = useRouter()
  const handle = router.query.handle as string
  const character = useGetCharacter(handle)
  const achievement = useGetAchievements(character.data?.characterId || 0)

  const tabs = [
    {
      title: "Achievements",
      icon: "✨",
    },
  ]

  const { address } = useAccount()

  const [isOwner, setIsOwner] = useState(false)
  useEffect(() => {
    setIsOwner(!!(address && address.toLowerCase?.() === character.data?.owner))
  }, [address, character.data?.owner])

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
            <>
              {achievement.data?.list?.map((series) => {
                let length = series.groups.length
                if (!isOwner) {
                  length = series.groups
                    .map((group) =>
                      group.items.filter((item) => item.status === "MINTED"),
                    )
                    .filter((item) => item.length).length
                }
                if (!length) {
                  return null
                }
                return (
                  <div key={series.info.name} className="mt-6">
                    <div className="text-lg font-medium mb-4">
                      {series.info.title}
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-7 gap-x-2 gap-y-5">
                      {series.groups?.map((group) => (
                        <AchievementItem
                          group={group}
                          key={group.info.name}
                          layoutId="achievements"
                          size={80}
                          character={character.data}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </>
          </Box>
        </div>
      </div>
    </div>
  )
}
