import React from "react"
import { CharacterEntity } from "crossbell"
import { useAccountState } from "@crossbell/connect-kit"

export function useIsSelf(character: CharacterEntity | null | undefined) {
  const account = useAccountState((s) => s.computed.account)

  return React.useMemo(() => {
    switch (account?.type) {
      case "email":
        return character?.characterId === account.characterId
      case "wallet":
        return account.handle === character?.handle
      default:
        return false
    }
  }, [character, account])
}
