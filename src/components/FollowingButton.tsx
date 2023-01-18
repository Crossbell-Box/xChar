import { useRouter } from "next/router"
import { Button } from "~/components/ui/Button"
import type { Variant } from "~/components/ui/Button"
import { useEffect, useState } from "react"
import {
  useAccountCharacter,
  useAccountState,
  useConnectModal,
  useFollowCharacter,
  useUnfollowCharacter,
} from "@crossbell/connect-kit"
import { useCharacterFollowRelation } from "@crossbell/indexer"

import clsx from "clsx"
import { BellIcon } from "@heroicons/react/24/solid"

export const FollowingButton: React.FC<{
  characterId?: number
  variant?: Variant
  className?: string
  size?: "sm" | "xl"
}> = ({ characterId, variant, className, size }) => {
  const account = useAccountState((s) => s.computed.account)
  const followCharacter = useFollowCharacter()
  const unfollowCharacter = useUnfollowCharacter()
  const { show: openConnectModal } = useConnectModal()
  const [followProgress, setFollowProgress] = useState<boolean>(false)
  const character = useAccountCharacter()
  const router = useRouter()

  const followRelation = useCharacterFollowRelation(
    character?.characterId,
    characterId,
  )

  const handleClickSubscribe = async (e: any) => {
    e.preventDefault()
    if (!account) {
      setFollowProgress(true)
      openConnectModal?.()
    } else if (!character) {
      router.push("/new")
    } else if (characterId) {
      if (followRelation.data?.isFollowing) {
        unfollowCharacter.mutate({ characterId })
      } else {
        followCharacter.mutate({ characterId })
      }
    }
  }

  useEffect(() => {
    if (followProgress && account && followRelation.isSuccess && characterId) {
      if (!character) {
        router.push("/new")
      }
      if (!followRelation.data?.isFollowing) {
        followCharacter.mutate({ characterId })
      }
      setFollowProgress(false)
    }
  }, [
    followRelation,
    router,
    followProgress,
    account,
    characterId,
    followCharacter,
    character,
  ])

  return (
    <Button
      variant={variant}
      onClick={handleClickSubscribe}
      className={clsx(className, "align-middle space-x-1 group")}
      isLoading={
        unfollowCharacter.isLoading ||
        followCharacter.isLoading ||
        (followRelation.isFetched ? followRelation.isLoading : false)
      }
      size={size}
      aria-label="follow"
      rounded="full"
    >
      <BellIcon className="h-4 w-4" />
      {followRelation.data?.isFollowing ? (
        <>
          <span className="group-hover:hidden">Following</span>
          <span className="hidden group-hover:block">Unfollow</span>
        </>
      ) : (
        <span>Follow</span>
      )}
    </Button>
  )
}
