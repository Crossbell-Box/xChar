import { Image } from "~/components/ui/Image"
import { UniLink } from "~/components/ui/UniLink"
import { Note } from "~/lib/types"
import dayjs from "~/lib/date"
import { Source } from "~/components/Source"
import { NoteModal } from "~/components/NoteModal"
import { useState } from "react"

export const NoteItem: React.FC<{
  note: Note
}> = ({ note }) => {
  const [opened, setOpened] = useState(false)

  return (
    <div className="mx-auto relative py-6 space-y-2 overflow-hidden border-b border-dashed last:border-b-0">
      <div className="cursor-pointer" onClick={() => setOpened(true)}>
        <div className="w-full">
          <span className="text-gray-400 relative">
            {dayjs
              .duration(dayjs(note.updatedAt).diff(dayjs(), "minute"), "minute")
              .humanize()}{" "}
            ago
          </span>
          <span className="flex my-2">
            {note.cover && (
              <span className="flex items-center relative w-20 h-20 mr-4 mt-0">
                <Image
                  className="object-cover rounded"
                  src={note.cover}
                  fill={true}
                  alt="cover"
                />
              </span>
            )}
            <span className="flex-1 space-y-2">
              {note.metadata?.content?.title && (
                <span className="line-clamp-1 font-medium text-lg">
                  {note.metadata?.content?.title}
                </span>
              )}
              <span className="line-clamp-3 relative overflow-hidden">
                {note.metadata?.content?.summary}
              </span>
            </span>
          </span>
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
      </div>
      <NoteModal opened={opened} setOpened={setOpened} note={note} />
    </div>
  )
}
