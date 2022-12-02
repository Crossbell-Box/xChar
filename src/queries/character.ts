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

export const useGetNotes = (
  options: Parameters<typeof characterModel.getNotes>[0],
) => {
  return useQuery(["getNotes", options.characterId, options], async () => {
    if (!options.characterId) {
      return null
    }
    return characterModel.getNotes(options)
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

export const useGetAchievements = (characterId: number) => {
  return useQuery(["getAchievements", characterId], async () => {
    if (!characterId) {
      return null
    }
    return characterModel.getAchievements(characterId)
  })
}

export const useGetCalendar = (characterId: number) => {
  return useQuery(["getCalendar", characterId], async () => {
    if (!characterId) {
      return null
    }
    return fetch(`/api/calendar?characterId=${characterId}`).then((res) =>
      res.json(),
    )
  })
}
