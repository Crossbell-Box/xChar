import { indexer } from "../lib/crossbell"

export const getCharacter = (handle: string) => {
  return indexer.getCharacterByHandle(handle)
}

export const getNotes = (characterId: number) => {
  return indexer.getNotes({
    characterId: characterId,
    limit: 1000,
  })
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

export const getAchievement = (characterId: number) => {
  return indexer.getAchievement(characterId, {
    status: ["MINTED"],
  })
}