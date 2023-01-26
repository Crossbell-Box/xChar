import { Modal, Stepper } from "@mantine/core"
import type { AchievementSection } from "crossbell.js"
import { motion } from "framer-motion"
import { Image } from "~/components/ui/Image"
import dayjs from "dayjs"
import Tilt from "react-parallax-tilt"
import { Badge } from "~/components/AchievementItem"
import { BlockchainIcon } from "~/components/icons/Blockchain"

export const AchievementModal: React.FC<{
  opened: boolean
  setOpened: (value: boolean) => void
  group: AchievementSection["groups"][number]
  layoutId: string
}> = ({ opened, setOpened, group, layoutId }) => {
  const achievement = group.items
    .filter((item) => item.status === "MINTED")
    .pop()

  if (!achievement) return null

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
      <div
        className="flex items-center flex-col"
        onClick={() => setOpened(false)}
      >
        <motion.div
          className="inline-flex flex-col text-center items-center text-white"
          key={achievement.info.tokenId}
          layoutId={layoutId + group.info.title}
        >
          <Tilt
            className="inline-block w-80 h-80 relative rounded-full bg-white mb-4 preserve-3d shadow-[inset_#a8a29e_34px_-34px_74px] p-[4%]"
            trackOnWindow={true}
            perspective={500}
            tiltAngleXInitial={10}
            tiltAngleYInitial={-10}
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            <Image
              fill
              alt="achievement"
              src={achievement.info.media}
              className="relative w-full h-full"
              style={{
                transform: "translateZ(20px)",
              }}
            />
          </Tilt>
          <div className="inline-flex flex-col flex-1 min-w-0 w-full space-y-1">
            <span className="capitalize text-4xl font-medium truncate">
              {group.info.title} #{achievement.tokenId}
            </span>
            <span className="text-lg text-gray-100 capitalize truncate">
              {achievement.info.description}
            </span>
            <span className="text-gray-300 leading-snug">
              Obtained{" "}
              {dayjs
                .duration(
                  dayjs(achievement.mintedAt).diff(dayjs(), "minute"),
                  "minute",
                )
                .humanize()}{" "}
              ago ·{" "}
              <>
                <BlockchainIcon
                  className="inline fill-gray-300 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(
                      `https://scan.crossbell.io/tx/${achievement.transactionHash}`,
                    )
                  }}
                />
              </>
            </span>
          </div>
        </motion.div>
        <div className="mt-8 hidden sm:block">
          <Stepper
            active={
              group.items.filter((item) => item.status === "MINTED").length
            }
            color="var(--theme-color)"
            size="sm"
            iconSize={42}
            styles={(theme) => ({
              stepLabel: {
                color: "#fff",
                textTransform: "capitalize",
              },
              stepDescription: {
                color: "#e5e7eb",
                marginBottom: "0",
                height: "25px",
                overflow: "visible",
              },
              separator: {
                minWidth: "30px",
                marginLeft: "4px",
                marginRight: "12px",
              },
              stepBody: {
                maxWidth: "80px",
              },
              stepIcon: {
                border: "none",
              },
            })}
          >
            {group.items.map((item) => {
              return (
                <Stepper.Step
                  icon={
                    <div className="grayscale text-[0px]">
                      <Badge media={item.info.media} size={42} />
                    </div>
                  }
                  completedIcon={<Badge media={item.info.media} size={42} />}
                  label={
                    item.info.attributes.find(
                      (attr) => attr.trait_type === "tier",
                    )?.value || item.name
                  }
                  description={item.info.description}
                  key={item.tokenId}
                />
              )
            })}
          </Stepper>
        </div>
      </div>
    </Modal>
  )
}
