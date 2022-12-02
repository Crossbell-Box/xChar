import * as characterModel from "../models/character"
import { QueryClient } from "@tanstack/react-query"
import { cacheGet } from "~/lib/redis.server"
import { getCalendar } from "~/lib/calendar"

export const fetchGetCharacter = async (
  handle: string,
  queryClient: QueryClient,
) => {
  if (!handle) {
    return null
  }
  const key = ["getCharacter", handle]
  return await queryClient.fetchQuery(key, async () => {
    return cacheGet(key, () => characterModel.getCharacter(handle))
  })
}

export const prefetchGetNotes = async (
  options: Parameters<typeof characterModel.getNotes>[0],
  queryClient: QueryClient,
) => {
  if (!options.characterId) {
    return null
  }
  const key = ["getNotes", options.characterId, options]
  await queryClient.prefetchQuery(key, async () => {
    return cacheGet(key, () => characterModel.getNotes(options))
  })
}

export const prefetchGetFollowings = async (
  characterId: number,
  queryClient: QueryClient,
) => {
  if (!characterId) {
    return null
  }
  const key = ["getFollowings", characterId]
  await queryClient.prefetchQuery(key, async () => {
    return cacheGet(key, () => characterModel.getFollowings(characterId))
  })
}

export const prefetchGetFollowers = async (
  characterId: number,
  queryClient: QueryClient,
) => {
  if (!characterId) {
    return null
  }
  const key = ["getFollowers", characterId]
  await queryClient.prefetchQuery(key, async () => {
    return cacheGet(key, () => characterModel.getFollowers(characterId))
  })
}

export const prefetchGetAchievements = async (
  characterId: number,
  queryClient: QueryClient,
) => {
  if (!characterId) {
    return null
  }
  const key = ["getAchievements", characterId]
  await queryClient.prefetchQuery(key, async () => {
    return cacheGet(key, () => characterModel.getAchievements(characterId))
  })
}

export const prefetchGetCalendar = async (
  characterId: number,
  queryClient: QueryClient,
) => {
  if (!characterId) {
    return null
  }
  const key = ["getCalendar", characterId]
  await queryClient.prefetchQuery(key, async () => {
    return cacheGet(key, () => getCalendar(characterId))
  })
}
