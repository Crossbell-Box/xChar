import { AnimatePresence, motion } from "framer-motion"
import type { AchievementSection } from "crossbell.js"
import { Image } from "~/components/ui/Image"
import dayjs from "dayjs"
import { AchievementModal } from "~/components/AchievementModal"
import { useEffect, useState } from "react"
import { Indicator } from "@mantine/core"

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
}> = ({ group, layoutId, size }) => {
  const achievement = group.items
    .filter((item) => item.status === "MINTED")
    .pop()

  const achievementMintable = group.items
    .filter((item) => item.status === "MINTABLE")
    .pop()

  const [opened, setOpened] = useState(false)
  const [actived, setActived] = useState(false)

  useEffect(() => {
    if (!opened) {
      setTimeout(() => {
        setActived(false)
      }, 200)
    }
  }, [opened])

  if (!achievement && !achievementMintable) return null

  return (
    <AnimatePresence>
      <div
        className={`relative cursor-pointer ${
          actived ? "z-[1]" : ""
        } hover:scale-110 transition-transform ease`}
      >
        <div
          className={`inline-flex flex-col text-center items-center pointer-events-none w-full ${
            !opened ? `absolute left-0 top-0` : ""
          }`}
        >
          <Badge
            media={(achievement || achievementMintable)!.info.media}
            className={`mb-1 ${!achievement && "grayscale"}`}
            size={size}
          />
          <span className="flex-1 min-w-0 w-full">
            {achievementMintable ? (
              <Indicator
                inline
                dot
                withBorder
                processing
                offset={-12}
                size={12}
                position="middle-start"
                color="red"
              >
                <span className="capitalize text-xs font-medium truncate">
                  {group.info.title}
                </span>
              </Indicator>
            ) : (
              <span className="capitalize text-xs font-medium truncate">
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
          </span>
        </div>
        {!opened && (
          <motion.div
            className="inline-flex flex-col text-center items-center w-full"
            onClick={() => {
              setOpened(true)
              setActived(true)
            }}
            layoutId={layoutId + group.info.title}
            transition={{ duration: 0.2 }}
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
                  dot
                  withBorder
                  processing
                  offset={-12}
                  size={12}
                  position="middle-start"
                  color="red"
                >
                  <span className="capitalize text-xs font-medium truncate">
                    {group.info.title}
                  </span>
                </Indicator>
              ) : (
                <span className="capitalize text-xs font-medium truncate">
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
          </motion.div>
        )}
        <AchievementModal
          opened={opened}
          setOpened={setOpened}
          group={group}
          layoutId={layoutId}
        />
      </div>
    </AnimatePresence>
  )
}
