import { indexer } from "../lib/crossbell"

export const getCharacter = (handle: string) => {
  return indexer.getCharacterByHandle(handle)
}

export const getNotes = (options: {
  characterId: number
  limit: number
  cursor?: string
}) => {
  return indexer.getNotes(options)
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
