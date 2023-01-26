import { AnimatePresence, motion } from "framer-motion"
import type { AchievementSection } from "crossbell.js"
import { Image } from "~/components/ui/Image"
import dayjs from "dayjs"
import { AchievementModal } from "~/components/AchievementModal"
import { useEffect, useState } from "react"

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

  const [opened, setOpened] = useState(false)
  const [actived, setActived] = useState(false)

  useEffect(() => {
    if (!opened) {
      setTimeout(() => {
        setActived(false)
      }, 200)
    }
  }, [opened])

  if (!achievement) return null

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
          <Badge media={achievement.info.media} className="mb-1" size={size} />
          <span className="inline-flex flex-col flex-1 min-w-0 w-full">
            <span className="capitalize text-xs font-medium truncate">
              {group.info.title}
            </span>
            <span className="text-[11px] text-gray-500 leading-snug">
              {dayjs
                .duration(
                  dayjs(achievement.mintedAt).diff(dayjs(), "minute"),
                  "minute",
                )
                .humanize()}{" "}
              ago
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
              media={achievement.info.media}
              className="mb-1"
              size={size}
            />
            <div className="inline-flex flex-col flex-1 min-w-0 w-full">
              <span className="capitalize text-xs font-medium truncate">
                {group.info.title}
              </span>
              <span className="text-[11px] text-gray-500 leading-snug">
                {dayjs
                  .duration(
                    dayjs(achievement.mintedAt).diff(dayjs(), "minute"),
                    "minute",
                  )
                  .humanize()}{" "}
                ago
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
