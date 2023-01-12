import { indexer } from "~/lib/crossbell"
import { Notes, Note } from "~/lib/types"
import type { Contract } from "crossbell.js"
import { toIPFS } from "~/lib/ipfs-parser"

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
  return indexer.getAchievements(characterId)
}

export const getCharacters = async (address: string, primary?: boolean) => {
  const result = await indexer.getCharacters(address, {
    limit: 50,
    primary,
  })
  result.list = result.list.sort((a, b) => {
    if (a.primary) {
      return -1
    } else if (b.primary) {
      return 1
    } else if (a.createdAt > b.createdAt) {
      return 1
    } else {
      return -1
    }
  })

  return result
}

export const getLinks = (characterId: number, toCharacterId: number) => {
  return indexer.getLinks(characterId, {
    toCharacterId: toCharacterId,
  })
}

export const linkCharacter = (
  contract: Contract,
  fromCharacterId: number,
  toCharacterId: number,
) => {
  return contract.linkCharacter(fromCharacterId, toCharacterId, "follow")
}

export const unlinkCharacter = (
  contract: Contract,
  fromCharacterId: number,
  toCharacterId: number,
) => {
  return contract.unlinkCharacter(fromCharacterId, toCharacterId, "follow")
}

export const updateCharacter = async (
  contract: Contract,
  input: {
    characterId: number
    handle: string
    avatar: string
    banner?: {
      address: string
      mime_type: string
    }
    name: string
    bio: string
  },
) => {
  return contract.changeCharacterMetadata(input.characterId, (metadata) => ({
    ...metadata,
    ...(input.name && { name: input.name }),
    ...(input.bio && { bio: input.bio }),
    ...(input.avatar && { avatars: [toIPFS(input.avatar)] }),
    ...(input.banner &&
      input.banner.address && {
        banners: [
          {
            address: toIPFS(input.banner.address),
            mime_type: input.banner.mime_type,
          },
        ],
      }),
  }))
}

export const updateHandle = async (
  contract: Contract,
  input: {
    characterId: number
    handle: string
  },
) => {
  await contract.setHandle(input.characterId, input.handle)
}

export const setPrimaryCharacter = async (
  contract: Contract,
  characterId: number,
) => {
  await contract.setPrimaryCharacterId(characterId)
}
