import { indexer } from "@crossbell/indexer"
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
  sources?: string[]
}) {
  if (!input.characterId) {
    return null
  }

  const notes = (await indexer.getNotes({
    characterId: input.characterId,
    limit: input.limit,
    cursor: input.cursor,
    ...(input.sources?.length && {
      sources: input.sources,
    }),
  })) as Notes

  if (notes?.list) {
    await Promise.all(
      notes?.list.map(async (note) => {
        await expandPage(note as Note)

        return note
      }),
    )
  }

  return notes
}

export async function getMintedNotes(input: {
  address?: string
  limit?: number
  cursor?: string
}) {
  if (!input.address) {
    return null
  }

  const notes = await indexer.getMintedNotesOfAddress(input.address, {
    limit: input.limit,
    ...(input.cursor && { cursor: input.cursor }),
  })
  await Promise.all(
    notes?.list.map(async (note) => {
      await expandPage(note.note as Note)
      return note
    }),
  )

  return notes
}

export const getFollowings = (characterId: number) => {
  return indexer.getLinks(characterId, {
    limit: 0,
    linkType: "follow",
  })
}

export const getFollowers = (characterId: number) => {
  return indexer.getBacklinksOfCharacter(characterId, {
    limit: 0,
    linkType: "follow",
  })
}

export const getAchievements = (characterId: number) => {
  return indexer.getAchievements(characterId)
}

export const mintAchievement = async (input: {
  characterId: number
  achievementId: number
}) => {
  return indexer.mintAchievement(input.characterId, input.achievementId)
}

export const getLinks = (characterId: number, toCharacterId: number) => {
  return indexer.getLinks(characterId, {
    toCharacterId: toCharacterId,
  })
}

export const getLatestMintedNotes = async (address: string) => {
  const notes = await indexer.getMintedNotesOfAddress(address, {
    limit: 8,
  })
  await Promise.all(
    notes?.list.map(async (note) => {
      await expandPage(note.note as Note)
      return note
    }),
  )

  return notes
}

export const getDistinctNoteSourcesOfCharacter = async (
  characterId: number,
) => {
  // return indexer.getDistinctNoteSourcesOfCharacter(characterId)
  return (
    await fetch(
      `https://indexer.crossbell.io/v1/characters/${characterId}/notes/sources`,
    )
  ).json()
}
