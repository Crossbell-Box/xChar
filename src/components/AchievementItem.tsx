import type { AchievementSection } from "crossbell"
import { Image } from "~/components/ui/Image"
import dayjs from "dayjs"
import { AchievementModal } from "~/components/AchievementModal"
import { useEffect, useState } from "react"
import { Indicator } from "@mantine/core"
import type { CharacterEntity } from "crossbell"
import { useAccountState } from "@crossbell/connect-kit"

export const Badge = ({
  media,
  size,
  className,
}: {
  media: string
  size?: number
  className?: string
}) => {
  return (
    <div
      className={
        "inline-block relative rounded-full bg-white shadow-[inset_#a8a29e_6px_-6px_13px] p-[4%]" +
        " " +
        className
      }
      style={{
        width: size || 56,
        height: size || 56,
      }}
    >
      <Image fill alt="achievement" src={media} />
    </div>
  )
}

export const AchievementItem: React.FC<{
  group: AchievementSection["groups"][number]
  layoutId: string
  size?: number
  character?: CharacterEntity | null
}> = ({ group, layoutId, size, character }) => {
  const [address] = useAccountState(({ computed }) => [
    computed.account?.address,
  ])

  const [isOwner, setIsOwner] = useState(false)
  useEffect(() => {
    setIsOwner(!!(address && address.toLowerCase?.() === character?.owner))
  }, [address, character?.owner])

  const achievement = group.items
    .filter((item) => item.status === "MINTED")
    .pop()

  const achievementMintable = isOwner
    ? group.items.filter((item) => item.status === "MINTABLE").pop()
    : null

  const [opened, setOpened] = useState(false)

  if (isOwner) {
    if (!achievement && !achievementMintable) {
      return null
    }
  } else {
    if (!achievement) {
      return null
    }
  }

  return (
    <div
      className={`achievement-group relative cursor-pointer hover:scale-110 transition-transform ease`}
    >
      <div
        className="inline-flex flex-col text-center items-center w-full"
        onClick={() => {
          setOpened(true)
        }}
      >
        <Badge
          media={(achievement || achievementMintable)!.info.media}
          className={`mb-1 ${!achievement && "grayscale"}`}
          size={size}
        />
        <div className="flex-1 min-w-0 w-full">
          {achievementMintable ? (
            <Indicator
              inline
              withBorder
              processing
              offset={-12}
              size={12}
              position="middle-start"
              color="red"
              className="inline-flex max-w-full justify-center items-center"
            >
              <span className="capitalize text-xs font-medium truncate max-w-full inline-block">
                {group.info.title}
              </span>
            </Indicator>
          ) : (
            <span className="capitalize text-xs font-medium truncate max-w-full inline-block">
              {group.info.title}
            </span>
          )}
          <span className="text-[11px] text-gray-500 leading-snug block">
            {achievement
              ? `${dayjs
                  .duration(
                    dayjs(achievement.mintedAt).diff(dayjs(), "minute"),
                    "minute",
                  )
                  .humanize()} ago`
              : "Mintable"}
          </span>
        </div>
      </div>
      <AchievementModal
        opened={opened}
        setOpened={setOpened}
        group={group}
        layoutId={layoutId}
        isOwner={isOwner}
      />
    </div>
  )
}
