import React from "react"
import { CharacterEntity } from "crossbell"
import { useAccountState } from "@crossbell/connect-kit"
import { isAddressEqual, Address } from "viem"

export function useIsSelf(character: CharacterEntity | null | undefined) {
  const account = useAccountState((s) => s.computed.account)

  return React.useMemo(() => {
    switch (account?.type) {
      case "email":
        return character?.characterId === account.characterId
      case "wallet":
        return isAddressEqual(
          account.handle as Address,
          (character?.handle ?? "") as Address,
        )
      default:
        return false
    }
  }, [character, account])
}
