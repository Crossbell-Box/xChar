import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query"
import * as characterModel from "../models/character"
import { useContract } from "~/lib/crossbell"

export const useGetCharacter = (handle: string) => {
  return useQuery(["getCharacter", handle], async () => {
    if (!handle) {
      return null
    }
    return characterModel.getCharacter(handle)
  })
}

export const useGetNotes = (
  input: Parameters<typeof characterModel.getNotes>[0],
) => {
  return useInfiniteQuery({
    queryKey: ["getNotes", input.characterId, input],
    queryFn: async ({ pageParam }) => {
      const result: ReturnType<typeof characterModel.getNotes> = await (
        await fetch(
          "/api/notes?" +
            new URLSearchParams({
              ...input,
              ...(pageParam && { cursor: pageParam }),
            } as any),
        )
      ).json()
      return result
    },
    getNextPageParam: (lastPage) => lastPage?.cursor,
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

export const useMintArchievement = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async (input: Parameters<typeof characterModel.mintAchievement>[0]) => {
      return characterModel.mintAchievement(input)
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries([
          "getAchievements",
          variables.characterId,
        ])
      },
    },
  )
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

export const useGetCharacters = (address?: string, primary?: boolean) => {
  return useQuery(["getCharacters", address, primary], async () => {
    if (!address) {
      return null
    }
    return characterModel.getCharacters(address, primary)
  })
}

export const useGetLinks = (characterId?: number, toCharacterId?: number) => {
  return useQuery(["getLinks", characterId, toCharacterId], async () => {
    if (!characterId || !toCharacterId) {
      return null
    }
    return characterModel.getLinks(characterId, toCharacterId)
  })
}

export const useLinkCharacter = () => {
  const contract = useContract()
  const queryClient = useQueryClient()
  return useMutation(
    async (input: { fromCharacterId?: number; toCharacterId?: number }) => {
      if (!input.fromCharacterId || !input.toCharacterId) {
        return null
      }
      return characterModel.linkCharacter(
        contract,
        input.fromCharacterId,
        input.toCharacterId,
      )
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(["getLinks", variables.fromCharacterId])
      },
    },
  )
}

export const useUnlinkCharacter = () => {
  const contract = useContract()
  const queryClient = useQueryClient()
  return useMutation(
    async (input: { fromCharacterId: number; toCharacterId: number }) => {
      return characterModel.unlinkCharacter(
        contract,
        input.fromCharacterId,
        input.toCharacterId,
      )
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(["getLinks", variables.fromCharacterId])
      },
    },
  )
}

export const useUpdateCharacter = () => {
  const contract = useContract()
  const queryClient = useQueryClient()
  return useMutation(
    async (input: Parameters<typeof characterModel.updateCharacter>[1]) => {
      return characterModel.updateCharacter(contract, input)
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(["getCharacter", variables.handle])
        queryClient.invalidateQueries(["getCalendar", variables.characterId])
      },
    },
  )
}

export const useUpdateHandle = () => {
  const contract = useContract()
  const queryClient = useQueryClient()
  return useMutation(
    async (input: Parameters<typeof characterModel.updateHandle>[1]) => {
      return characterModel.updateHandle(contract, input)
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(["getCharacter", variables.handle])
        queryClient.invalidateQueries(["getCalendar", variables.characterId])
      },
    },
  )
}

export const useSetPrimaryCharacter = () => {
  const contract = useContract()
  const queryClient = useQueryClient()
  return useMutation(
    async (characterId: number) => {
      return characterModel.setPrimaryCharacter(contract, characterId)
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(["getCharacter"])
      },
    },
  )
}

export const useGetLatestMintedNotes = (address?: string) => {
  return useQuery(["getLatestMintedNotes", address], async () => {
    if (!address) {
      return null
    }
    return characterModel.getLatestMintedNotes(address)
  })
}
