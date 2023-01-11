import { AnimatePresence, motion } from "framer-motion"
import type { AchievementSection } from "crossbell.js"
import { Image } from "~/components/ui/Image"
import dayjs from "dayjs"
import { AchievementModal } from "~/components/AchievementModal"
import { useEffect, useState } from "react"

export const Achievement: React.FC<{
  group: AchievementSection["groups"][number]
}> = ({ group }) => {
  const achievement = group.items[group.items.length - 1]
  const [opened, setOpened] = useState(false)
  const [actived, setActived] = useState(false)

  useEffect(() => {
    if (!opened) {
      setTimeout(() => {
        setActived(false)
      }, 200)
    }
  }, [opened])

  return (
    <AnimatePresence>
      <div className={`relative cursor-pointer ${actived ? "z-[1]" : ""}`}>
        <div className="inline-flex flex-col text-center items-center absolute left-0 top-0 right-0 pointer-events-none">
          <span className="inline-block w-14 h-14 relative rounded-full bg-white mb-1">
            <span className="inline-block w-full h-full shadow-[inset_#a8a29e_6px_-6px_13px] p-1 rounded-full">
              <Image
                width={56}
                height={56}
                alt="achievement"
                src={achievement.info.media}
              />
            </span>
          </span>
          <span className="inline-flex flex-col flex-1 min-w-0 w-full">
            <span className="capitalize text-xs font-medium truncate">
              {group.info.title}
            </span>
            <span className="text-[11px] text-gray-500 leading-snug">
              {dayjs(achievement.mintedAt).format("DD/MM/YYYY")}
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
            <div
              className="inline-block w-14 h-14 relative rounded-full bg-white mb-1 shadow-[inset_#a8a29e_6px_-6px_13px] p-1"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              <div
                style={{
                  transform: "translateZ(20px)",
                }}
              >
                <Image
                  width={56}
                  height={56}
                  alt="achievement"
                  src={achievement.info.media}
                />
                <span className="inline-block animate-shine absolute left-1 right-1 top-1 bottom-1 rounded-full"></span>
              </div>
            </div>
            <span className="inline-flex flex-col flex-1 min-w-0 w-full">
              <span className="capitalize text-xs font-medium truncate">
                {group.info.title}
              </span>
              <span className="text-[11px] text-gray-500 leading-snug">
                {dayjs(achievement.mintedAt).format("DD/MM/YYYY")}
              </span>
            </span>
          </motion.div>
        )}
        <AchievementModal opened={opened} setOpened={setOpened} group={group} />
      </div>
    </AnimatePresence>
  )
}
