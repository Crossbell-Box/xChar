import { indexer } from "../lib/crossbell"
import { Notes, Note } from "~/lib/types"

const expandPage = async (note: Note) => {
  note.cover = note?.metadata?.content?.attachments?.find((attachment) =>
    attachment.mime_type?.startsWith("image/"),
  )?.address

  if (note.metadata?.content?.content) {
    const { renderPageContent } = await import("~/markdown")
    const rendered = renderPageContent(note.metadata.content.content, true)
    if (!note.metadata?.content?.summary) {
      note.metadata.content.summary = rendered.excerpt
    }
    if (!note.cover) {
      note.cover = rendered.cover
    }
  }

  return note
}

export const getCharacter = (handle: string) => {
  return indexer.getCharacterByHandle(handle)
}

export async function getNotes(input: {
  characterId: number
  limit?: number
  cursor?: string
  keepBody?: boolean
}) {
  if (!input.characterId) {
    return null
  }

  const notes = (await indexer.getNotes({
    characterId: input.characterId,
    limit: input.limit,
    cursor: input.cursor,
  })) as Notes

  if (notes?.list) {
    await Promise.all(
      notes?.list.map(async (note) => {
        await expandPage(note as Note)

        if (!input.keepBody) {
          delete note.metadata?.content?.content
        }

        return note
      }),
    )
  }

  return notes
}

export const getFollowings = (characterId: number) => {
  return indexer.getLinks(characterId, {
    limit: 0,
  })
}

export const getFollowers = (characterId: number) => {
  return indexer.getBacklinksOfCharacter(characterId, {
    limit: 0,
  })
}

export const getAchievements = (characterId: number) => {
  return indexer.getAchievement(characterId, {
    status: ["MINTED"],
  })
}
