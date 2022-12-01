import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import * as characterModel from "../models/character"

export const useGetCharacter = (handle: string) => {
  return useQuery(["getCharacter", handle], async () => {
    if (!handle) {
      return null
    }
    return characterModel.getCharacter(handle)
  })
}

export const useGetNotes = (characterId: number) => {
  return useQuery(["getNotes", characterId], async () => {
    if (!characterId) {
      return null
    }
    return characterModel.getNotes(characterId)
  })
}

export const useGetFollowings = (characterId: number) => {
  return useQuery(["getFollowings", characterId], async () => {
    if (!characterId) {
      return null
    }
    return characterModel.getFollowings(characterId)
  })
}

export const useGetFollowers = (characterId: number) => {
  return useQuery(["getFollowers", characterId], async () => {
    if (!characterId) {
      return null
    }
    return characterModel.getFollowers(characterId)
  })
}

export const useGetAchievement = (characterId: number) => {
  return useQuery(["getAchievement", characterId], async () => {
    if (!characterId) {
      return null
    }
    return characterModel.getAchievement(characterId)
  })
}

export const useGetSync = (characterId: number) => {
  return useQuery(["getSync", characterId], async () => {
    if (!characterId) {
      return null
    }
    return characterModel.getSync(characterId)
  })
}
