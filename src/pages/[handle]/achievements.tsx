import {
  Modal,
  Text,
  SimpleGrid,
  SimpleGridProps,
  Skeleton,
} from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import React from "react"
import Head from "next/head"
import Image from "next/image"

import { getLayout } from "@/components/layouts/AppLayout"
import {
  useAchievementGroups,
  AchievementInfo,
  AchievementGroup,
} from "@/utils/apis/achievement"
import { extractCharacterName } from "@/utils/metadata"
import Header from "@/components/layouts/Header"
import {
  AchievementsTitle,
  Badge,
  ComingSoon,
  BadgeDetail,
} from "@/components/achievement"
import { useCharacterInfos } from "@/components/achievement/hooks"

import errorImgUrl from "@/public/illustrations/404-purple.png"

import { getServerSideProps } from "./index"

export { getServerSideProps }

const gridProps: SimpleGridProps = {
  cols: 4,
  spacing: 32,
  breakpoints: [
    { maxWidth: 1200, cols: 3, spacing: 32 },
    { maxWidth: 980, cols: 2, spacing: "sm" },
    { maxWidth: 600, cols: 1, spacing: "sm" },
  ],
}

export default function Page() {
  const { character, handle, isConnectedCharacter } = useCharacterInfos()
  const [achievementGroups, status] = useAchievementGroups(character)
  const [displayModal, modal] = useDisclosure(false)
  const { selectedAchievement, selectAchievement } =
    useSelectAchievement(achievementGroups)

  if (!character) {
    return <PageLoading />
  }

  if (!isConnectedCharacter) {
    return <PageError />
  }

  return (
    <div>
      <Head>
        <title>{`${extractCharacterName(character)} (@${handle})`}</title>
      </Head>

      <Header hasBackButton>Achievement</Header>

      {(() => {
        switch (status) {
          case "loading":
            return <PageLoading />
          case "error":
            return (
              <div className="flex items-center justify-center pt-100px">
                <Image
                  width={374}
                  height={374}
                  src={errorImgUrl}
                  alt="Error Illustration"
                />
              </div>
            )
          case "success":
            return (
              <div>
                <Modal
                  withCloseButton={false}
                  opened={displayModal}
                  onClose={modal.close}
                  padding={0}
                  radius={12}
                  size="500px"
                >
                  <button
                    onClick={modal.close}
                    className="bg-[#312F39] hover:bg-white/20 transition absolute right-16px top-16px w-32px h-32px border-none rounded-full flex items-center justify-center outline-none cursor-pointer"
                  >
                    <Text className="i-csb:close text-white text-24px" />
                  </button>
                  {selectedAchievement && (
                    <BadgeDetail
                      achievement={selectedAchievement}
                      characterId={character.characterId}
                    />
                  )}
                </Modal>

                <div>
                  {achievementGroups.map((group) => (
                    <div key={group.id} className="mt-40px">
                      <AchievementsTitle>{group.title}</AchievementsTitle>
                      <div className="mt-40px px-24px">
                        <SimpleGrid {...gridProps}>
                          {group.achievements.map((achievement) => {
                            const showAchievement = () => {
                              selectAchievement(achievement)
                              modal.open()
                            }

                            return (
                              <div
                                key={achievement.id}
                                onClick={showAchievement}
                                className="cursor-pointer"
                              >
                                <Badge achievement={achievement} />
                              </div>
                            )
                          })}
                        </SimpleGrid>
                      </div>
                    </div>
                  ))}
                </div>

                <ComingSoon />
              </div>
            )
        }
      })()}
    </div>
  )
}

function useSelectAchievement(achievementGroups: AchievementGroup[]) {
  const [selectedAchievementId, setSelectedAchievementId] = React.useState<
    AchievementInfo["id"] | null
  >(null)

  const achievements = React.useMemo(
    () => achievementGroups.flatMap(({ achievements }) => achievements),
    [achievementGroups],
  )

  return React.useMemo(
    () => ({
      selectedAchievement:
        achievements.find(({ id }) => selectedAchievementId === id) ?? null,

      selectAchievement(achievement: AchievementInfo) {
        setSelectedAchievementId(achievement.id)
      },
    }),
    [achievements, selectedAchievementId],
  )
}
