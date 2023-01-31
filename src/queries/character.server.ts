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
  input: Parameters<typeof characterModel.getNotes>[0],
  queryClient: QueryClient,
) => {
  if (!input.characterId) {
    return null
  }

  const key = ["getNotes", input.characterId, input]
  return queryClient.prefetchInfiniteQuery({
    queryKey: key,
    queryFn: async ({ pageParam }) => {
      return cacheGet(key, () =>
        characterModel.getNotes({
          ...input,
          cursor: pageParam,
        }),
      )
    },
    getNextPageParam: (lastPage) => lastPage?.cursor || undefined,
  })
}

export const prefetchGetMintedNotes = async (
  input: Parameters<typeof characterModel.getMintedNotes>[0],
  queryClient: QueryClient,
) => {
  if (!input.address) {
    return null
  }

  const key = ["getMintedNotes", input.address, input]
  return queryClient.prefetchInfiniteQuery({
    queryKey: key,
    queryFn: async ({ pageParam }) => {
      return cacheGet(key, () =>
        characterModel.getMintedNotes({
          ...input,
          cursor: pageParam,
        }),
      )
    },
    getNextPageParam: (lastPage) => lastPage?.cursor || undefined,
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

export const prefetchGetLatestMintedNotes = async (
  address: string,
  queryClient: QueryClient,
) => {
  if (!address) {
    return null
  }
  const key = ["getLatestMintedNotes", address]
  await queryClient.prefetchQuery(key, async () => {
    return cacheGet(key, () => characterModel.getLatestMintedNotes(address))
  })
}

export const prefetchGetDistinctNoteSourcesOfCharacter = async (
  characterId: number,
  queryClient: QueryClient,
) => {
  if (!characterId) {
    return null
  }
  const key = ["getDistinctNoteSourcesOfCharacter ", characterId]
  await queryClient.prefetchQuery(key, async () => {
    return cacheGet(key, () =>
      characterModel.getDistinctNoteSourcesOfCharacter(characterId),
    )
  })
}
