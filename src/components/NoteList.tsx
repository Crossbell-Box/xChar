import {
  useGetNotes,
  useGetDistinctNoteSourcesOfCharacter,
} from "~/queries/character"
import { HeatMap } from "~/components/HeatMap"
import InfiniteScroll from "react-infinite-scroller"
import { NoteItem } from "~/components/NoteItem"
import type { CharacterEntity } from "crossbell.js"
import { Source } from "~/components/Source"
import { useState } from "react"

export const NoteList = ({
  character,
}: {
  character?: CharacterEntity | null
}) => {
  const [activeSources, setActiveSources] = useState<string[]>()

  const notes = useGetNotes({
    characterId: character?.characterId || 0,
    limit: 10,
    sources: activeSources,
  })

  const sourceList = useGetDistinctNoteSourcesOfCharacter(
    character?.characterId,
  )

  const toggleSource = (source: string) => {
    if (activeSources) {
      if (!activeSources.includes(source)) {
        setActiveSources([source])
      } else {
        setActiveSources(undefined)
      }
    } else {
      setActiveSources([source])
    }
  }

  return (
    <>
      <div className="relative flex justify-center w-full">
        <HeatMap characterId={character?.characterId} />
      </div>
      <div className="relative text-xs mt-4 leading-snug">
        {(sourceList?.data?.list || []).map((source: any) => (
          <Source
            key={source}
            name={source}
            onClick={() => toggleSource(source)}
            inactive={activeSources && !activeSources.includes(source)}
          ></Source>
        ))}
      </div>
      <div>
        <InfiniteScroll
          loadMore={notes.fetchNextPage as any}
          hasMore={notes.hasNextPage}
          loader={
            <div
              className="relative mt-4 w-full text-sm text-center py-4"
              key={"loading"}
            >
              Loading ...
            </div>
          }
        >
          {!!notes.data?.pages?.[0]?.count &&
            notes.data?.pages?.map((page) =>
              page?.list.map((note) => (
                <NoteItem note={note} key={note.noteId} />
              )),
            )}
        </InfiniteScroll>
      </div>
    </>
  )
}
