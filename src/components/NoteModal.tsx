import { Image } from "~/components/ui/Image"
import { UniLink } from "~/components/ui/UniLink"
import { Note } from "~/lib/types"
import dayjs from "~/lib/date"
import { Source } from "~/components/Source"
import { Modal } from "@mantine/core"
import { useMemo } from "react"
import { renderPageContent } from "~/markdown"
import { LinkIcon, ClockIcon } from "@heroicons/react/24/outline"

export const NoteModal: React.FC<{
  opened: boolean
  setOpened: (value: boolean) => void
  note: Note
}> = ({ opened, setOpened, note }) => {
  const inParsedContent = useMemo(() => {
    if (note.metadata?.content?.content || note.metadata?.content?.summary) {
      const result = renderPageContent(
        note.metadata?.content?.content || note.metadata?.content?.summary!,
      )
      return result
    } else {
      return null
    }
  }, [note.metadata?.content?.content, note.metadata?.content?.summary])

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      centered
      size="auto"
      transitionDuration={200}
      exitTransitionDuration={200}
      withCloseButton={false}
      className="space-y-2"
      styles={(theme) => ({
        modal: {
          maxWidth: "800px",
        },
      })}
    >
      <div>
        <div className="w-full">
          <div className="space-x-6 items-center flex">
            <span className="text-gray-400 relative items-center inline-flex">
              <UniLink
                href={
                  note.metadata?.content?.external_urls?.[0] &&
                  note.metadata?.content?.external_urls?.[0] !==
                    "https://crossbell.io"
                    ? note.metadata.content.external_urls[0]
                    : `https://crossbell.io/notes/${note.characterId}-${note.noteId}`
                }
                className="items-center inline-flex"
              >
                <LinkIcon className="w-4 h-4 inline-block mr-1" />
                open in source
              </UniLink>
            </span>
            <span className="text-gray-400 relative items-center inline-flex">
              <ClockIcon className="w-4 h-4 inline-block mr-1" />
              {dayjs
                .duration(
                  dayjs(note.updatedAt).diff(dayjs(), "minute"),
                  "minute",
                )
                .humanize()}{" "}
              ago
            </span>
          </div>
          <div className="flex my-2">
            <div className="flex-1 space-y-2">
              {note.metadata?.content?.title && (
                <div className="font-bold text-4xl my-6">
                  {note.metadata?.content?.title}
                </div>
              )}
              <div className="prose">{inParsedContent?.element}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-xs relative">
          {note.metadata?.content?.sources?.map((source) => (
            <Source key={source} name={source} />
          ))}
        </div>
        <div className="mr-1 text-gray-400 relative">
          <UniLink
            href={`https://scan.crossbell.io/tx/${note.updatedTransactionHash}`}
          >
            #{note.noteId} {note.updatedTransactionHash.slice(0, 5)}
            ...
            {note.updatedTransactionHash.slice(-4)}
          </UniLink>
        </div>
      </div>
    </Modal>
  )
}
