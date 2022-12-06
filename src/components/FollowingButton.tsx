import { useRouter } from "next/router"
import { Button } from "~/components/ui/Button"
import type { Variant } from "~/components/ui/Button"
import { useAccount } from "wagmi"
import { useEffect, useState } from "react"
import {
  useGetLinks,
  useLinkCharacter,
  useUnlinkCharacter,
  useGetCharacters,
} from "~/queries/character"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import clsx from "clsx"
import { BellIcon } from "@heroicons/react/24/solid"

export const FollowingButton: React.FC<{
  characterId?: number
  variant?: Variant
  className?: string
  size?: "sm" | "xl"
}> = ({ characterId, variant, className, size }) => {
  const { address } = useAccount()
  const linkCharacter = useLinkCharacter()
  const unlinkCharacter = useUnlinkCharacter()
  const { openConnectModal } = useConnectModal()
  const [followProgress, setFollowProgress] = useState<boolean>(false)
  const userCharacters = useGetCharacters(address, true)
  const router = useRouter()

  const backlinks = useGetLinks(
    userCharacters.data?.list[0].characterId,
    characterId,
  )

  const handleClickSubscribe = async (e: any) => {
    e.preventDefault()
    if (!address) {
      setFollowProgress(true)
      openConnectModal?.()
    } else if (!userCharacters.data?.count) {
      router.push("/new")
    } else if (characterId) {
      if (backlinks.data?.count) {
        unlinkCharacter.mutate({
          fromCharacterId: userCharacters.data?.list[0].characterId,
          toCharacterId: characterId,
        })
      } else {
        linkCharacter.mutate({
          fromCharacterId: userCharacters.data?.list[0].characterId,
          toCharacterId: characterId,
        })
      }
    }
  }

  useEffect(() => {
    if (
      followProgress &&
      address &&
      backlinks.isSuccess &&
      characterId &&
      userCharacters.isSuccess
    ) {
      if (!userCharacters.data?.count) {
        router.push("/new")
      }
      if (!backlinks.data?.count) {
        linkCharacter.mutate({
          fromCharacterId: userCharacters.data?.list[0].characterId,
          toCharacterId: characterId,
        })
      }
      setFollowProgress(false)
    }
  }, [
    backlinks.isSuccess,
    backlinks.data?.count,
    router,
    followProgress,
    address,
    userCharacters.isSuccess,
    userCharacters.data,
    characterId,
    linkCharacter,
  ])

  return (
    <Button
      variant={variant}
      onClick={handleClickSubscribe}
      className={clsx(className, "align-middle space-x-1")}
      isLoading={
        backlinks.data?.count
          ? linkCharacter.isLoading || unlinkCharacter.isLoading
          : userCharacters.isLoading ||
            unlinkCharacter.isLoading ||
            linkCharacter.isLoading ||
            backlinks.isLoading
      }
      size={size}
      aria-label="follow"
      rounded="full"
    >
      <BellIcon className="h-4 w-4" />
      {backlinks.data?.count ? (
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
