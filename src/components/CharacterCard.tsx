import {
  useGetCharacter,
  useGetFollowers,
  useGetFollowings,
  useGetNotes,
} from "~/queries/character"
import { useAccount } from "wagmi"
import { useRouter } from "next/router"
import Tilt from "react-parallax-tilt"
import dayjs from "~/lib/date"
import { Avatar } from "~/components/ui/Avatar"
import { UniLink } from "~/components/ui/UniLink"
import { PencilSquareIcon } from "@heroicons/react/24/solid"
import { Button } from "~/components/ui/Button"
import { FollowingButton } from "~/components/FollowingButton"
import { useEffect, useState } from "react"
import { BlockchainIcon } from "~/components/icons/Blockchain"
import { MoreButton } from "~/components/MoreButton"
import { Image } from "~/components/ui/Image"
import Head from "next/head"
import { toGateway } from "~/lib/ipfs-parser"

export const CharacterCard = () => {
  const router = useRouter()
  const handle = router.query.handle as string
  const character = useGetCharacter(handle)
  const followers = useGetFollowers(character.data?.characterId || 0)
  const followings = useGetFollowings(character.data?.characterId || 0)
  const notes = useGetNotes({
    characterId: character.data?.characterId || 0,
    limit: 10,
  })
  const { address } = useAccount()

  const [isOwner, setIsOwner] = useState(false)
  useEffect(() => {
    setIsOwner(!!(address && address.toLowerCase?.() === character.data?.owner))
  }, [address, character.data?.owner])

  return (
    <div className="relative">
      <Head>
        <title>
          {(character.data?.metadata?.content?.name
            ? `${character.data.metadata.content.name} (@${character.data?.handle})`
            : `@${character.data?.handle}`) + " / xChar"}
        </title>
        <meta
          name="description"
          content={character.data?.metadata?.content?.bio}
        />
        <link
          rel="icon"
          href={toGateway(
            character.data?.metadata?.content?.avatars?.[0] || "/favicon.ico",
          )}
        />
      </Head>
      <UniLink
        href="/"
        className="absolute right-full top-14 bottom-0 mr-16 w-20 h-20"
      >
        <Image alt="xChar" src="/logos/xchar.svg" fill />
      </UniLink>
      <Tilt
        className="sm:w-[800px] w-full mx-auto relative p-8 sm:rounded-3xl text-gray-600 sm:shadow"
        tiltMaxAngleX={5}
        tiltMaxAngleY={5}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white to-gray-200 opacity-50 sm:rounded-3xl"></div>
        <div className="flex relative flex-col sm:flex-row">
          <div className="absolute right-0 top-0 space-x-4">
            <MoreButton
              handle={handle}
              address={character?.data?.owner}
              ipfsUri={character.data?.metadata?.uri}
            />
            {isOwner ? (
              <UniLink href={`/${handle}/edit`}>
                <Button
                  className="align-middle space-x-1"
                  aria-label="follow"
                  rounded="full"
                >
                  <PencilSquareIcon className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </UniLink>
            ) : (
              <FollowingButton
                className="rounded-full"
                characterId={character.data?.characterId}
              />
            )}
          </div>
          <div className="sm:w-32 sm:text-center mr-4 flex flex-col sm:items-center justify-between">
            {character.data?.metadata?.content?.avatars && (
              <Avatar
                className="rounded-full inline-block"
                name={handle}
                images={character.data?.metadata?.content?.avatars}
                size={88}
              />
            )}
            <div className="mt-1 font-bold text-xl">
              No.{character.data?.characterId}
            </div>
          </div>
          <div className="flex-1 min-w-0 mt-4 sm:mt-0">
            <p>
              <span className="font-bold text-2xl">
                {character.data?.metadata?.content?.name}
              </span>
              <span className="font-medium text-base ml-2 text-zinc-500">
                @{handle}
              </span>
            </p>
            <p className="truncate text-sm mt-1">
              {character.data?.metadata?.content?.bio}
            </p>
            <div className="space-x-5 mt-2">
              <UniLink href={`https://crossbell.io/@${handle}/followers`}>
                <strong>{followers.data?.count}</strong> Followers
              </UniLink>
              <UniLink href={`https://crossbell.io/@${handle}/following`}>
                <strong>{followings.data?.count}</strong> Following
              </UniLink>
              <span>
                <strong>{notes.data?.pages?.[0]?.count}</strong> Notes
              </span>
            </div>
            <div className="text-gray-500 mt-2 text-sm">
              <UniLink
                href={`https://scan.crossbell.io/tx/${character.data?.transactionHash}`}
              >
                Joined{" "}
                {dayjs
                  .duration(
                    dayjs(character?.data?.createdAt).diff(dayjs(), "minute"),
                    "minute",
                  )
                  .humanize()}{" "}
                ago · <BlockchainIcon className="inline fill-current" />
              </UniLink>
            </div>
          </div>
        </div>
      </Tilt>
    </div>
  )
}
