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
        "inline-block relative rounded-full bg-white shadow-[inset_#a8a29e_6px_-6px_13px] p-1" +
        " " +
        className
      }
      style={{
        width: size || 56,
        height: size || 56,
      }}
    >
      <div>
        <Image width={56} height={56} alt="achievement" src={media} />
      </div>
    </div>
  )
}

export const Achievement: React.FC<{
  group: AchievementSection["groups"][number]
}> = ({ group }) => {
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
      <div className={`relative cursor-pointer ${actived ? "z-[1]" : ""}`}>
        <div className="inline-flex flex-col text-center items-center absolute left-0 top-0 right-0 pointer-events-none">
          <Badge media={achievement.info.media} className="mb-1" />
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
            layoutId={group.info.title}
            transition={{ duration: 0.2 }}
          >
            <Badge media={achievement.info.media} className="mb-1" />
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
        <AchievementModal opened={opened} setOpened={setOpened} group={group} />
      </div>
    </AnimatePresence>
  )
}
