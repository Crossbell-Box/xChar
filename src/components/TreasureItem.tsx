import { Image } from "~/components/ui/Image"
import { UniLink } from "~/components/ui/UniLink"
import { UserIcon } from "@heroicons/react/24/solid"
import type { MintedNoteEntity } from "crossbell"
import { Note } from "~/lib/types"

export const TreasureItem: React.FC<{
  note: MintedNoteEntity
  size?: "base" | "lg"
}> = ({ note, size }) => {
  return (
    <UniLink
      className="shadow h-0 pt-[160%] rounded-md relative hover:scale-110 hover:shadow transition-all ease"
      href={
        note.note?.metadata?.content?.external_urls?.[0] &&
        note.note?.metadata?.content?.external_urls?.[0] !==
          "https://crossbell.io"
          ? note.note?.metadata.content.external_urls[0]
          : `https://crossbell.io/notes/${note.noteCharacterId}-${note.noteId}`
      }
    >
      <div className="absolute top-0 bottom-0 left-0 right-0 rounded-md overflow-hidden">
        <div className={`${size == "lg" ? "h-[55%]" : "h-[53%]"}`}>
          {(note.note as Note).cover ? (
            <Image
              alt={note.noteCharacterId + "-" + note.noteId}
              src={(note.note as Note).cover!}
              fill={true}
              className="object-cover"
            />
          ) : (
            <div
              className={`h-full overflow-hidden ${
                size == "lg" ? "text-xs" : "text-[10px]"
              } leading-normal p-1 bg-slate-100 text-slate-500`}
            >
              {(note.note as Note)?.metadata?.content?.summary}
            </div>
          )}
        </div>
        <div
          className={`${
            size == "lg" ? "h-[45%] px-2 pb-2" : "h-[47%] px-1 pb-1"
          } font-medium flex flex-col justify-between pt-2`}
        >
          <div
            className={`${
              size == "lg" ? "text-sm line-clamp-3" : "text-xs line-clamp-2"
            } leading-tight`}
          >
            {note.note?.metadata?.content?.title ||
              (note.note as Note)?.metadata?.content?.summary}
          </div>
          <div
            className={`${
              size == "lg" ? "text-xs" : "text-[10px]"
            } line-clamp-1 text-gray-500`}
          >
            <UserIcon className="w-[10px] h-[10px] inline mr-[2px] align-middle" />
            <span className="align-middle">
              {note.noteCharacter?.metadata?.content?.name ||
                note.noteCharacter?.handle}
            </span>
          </div>
        </div>
      </div>
    </UniLink>
  )
}
