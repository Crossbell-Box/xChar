import { Modal } from "@mantine/core"
import type { AchievementSection } from "crossbell.js"
import { motion } from "framer-motion"
import { Image } from "~/components/ui/Image"
import dayjs from "dayjs"
import Tilt from "react-parallax-tilt"

export const AchievementModal: React.FC<{
  opened: boolean
  setOpened: (value: boolean) => void
  group: AchievementSection["groups"][number]
}> = ({ opened, setOpened, group }) => {
  const achievement = group.items[group.items.length - 1]

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      centered
      size="auto"
      transitionDuration={200}
      exitTransitionDuration={200}
      overlayOpacity={0.5}
      shadow="none"
      withCloseButton={false}
      styles={(theme) => ({
        modal: {
          background: "none",
        },
      })}
    >
      <motion.div
        className="inline-flex flex-col text-center items-center text-white"
        key={achievement.info.tokenId}
        onClick={() => setOpened(true)}
        layoutId={group.info.title}
      >
        <Tilt
          className="inline-block w-80 h-80 relative rounded-full bg-white mb-4 preserve-3d shadow-[inset_#a8a29e_34px_-34px_74px] p-6"
          trackOnWindow={true}
          perspective={500}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className="relative"
            style={{
              transform: "translateZ(20px)",
            }}
          >
            <Image
              width={320}
              height={320}
              alt="achievement"
              src={achievement.info.media}
            />
            <span className="inline-block animate-shine-xl absolute left-0 right-0 top-0 bottom-0 rounded-full"></span>
          </div>
        </Tilt>
        <span className="inline-flex flex-col flex-1 min-w-0 w-full">
          <span className="capitalize text-3xl font-medium truncate">
            {group.info.title}
          </span>
          <span className="text-lg text-gray-300 leading-snug">
            {dayjs(achievement.mintedAt).format("DD/MM/YYYY")}
          </span>
        </span>
      </motion.div>
    </Modal>
  )
}
