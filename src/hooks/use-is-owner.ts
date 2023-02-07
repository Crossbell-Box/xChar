import React from "react"
import { CharacterEntity } from "crossbell.js"
import { useAccountState } from "@crossbell/connect-kit"
import { isAddressEqual } from "@crossbell/util-ethers"

export function useIsOwner(character: CharacterEntity | null | undefined) {
  const account = useAccountState((s) => s.computed.account)

  return React.useMemo(() => {
    switch (account?.type) {
      case "email":
        return character?.characterId === account.characterId
      case "wallet":
        return isAddressEqual(account.address, character?.owner)
      default:
        return false
    }
  }, [character, account])
}
