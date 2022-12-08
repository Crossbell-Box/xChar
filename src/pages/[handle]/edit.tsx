import {
  useGetCharacter,
  useUpdateCharacter,
  useUpdateHandle,
  useSetPrimaryCharacter,
} from "~/queries/character"
import { useAccount } from "wagmi"
import { useRouter } from "next/router"
import { Image } from "~/components/ui/Image"
import Head from "next/head"
import { toGateway } from "~/lib/ipfs-parser"
import { Button } from "~/components/ui/Button"
import { useEffect, useState } from "react"
import { Input } from "~/components/ui/Input"
import { ImageUploader } from "~/components/ui/ImageUploader"
import { useForm, Controller } from "react-hook-form"
import toast from "react-hot-toast"
import { toIPFS } from "~/lib/ipfs-parser"

export default function EditPage() {
  const router = useRouter()
  const handle = router.query.handle as string
  const character = useGetCharacter(handle)
  const { address } = useAccount()

  useEffect(() => {
    if (
      handle &&
      character.data?.owner &&
      address &&
      character.data?.owner !== address?.toLowerCase?.()
    ) {
      router.push(`/${handle}`)
    }
  }, [character.isSuccess, character.data?.owner, address, handle, router])

  const updateCharacter = useUpdateCharacter()
  const updateHandle = useUpdateHandle()
  const setPrimaryCharacter = useSetPrimaryCharacter()

  const handleForm = useForm({
    defaultValues: {
      handle: "",
    } as {
      handle: string
    },
  })

  const metadataForm = useForm({
    defaultValues: {
      avatar: "",
      banner: undefined,
      name: "",
      bio: "",
    } as {
      avatar: string
      banner?: {
        address: string
        mime_type: string
      }
      name: string
      bio: string
    },
  })

  const metadataSubmit = metadataForm.handleSubmit((values) => {
    if (character.data?.characterId) {
      updateCharacter.mutate({
        characterId: character.data.characterId,
        handle: handle,
        avatar: values.avatar,
        banner: values.banner,
        name: values.name,
        bio: values.bio,
      })
    } else {
      toast.error("Failed to update character: characterId not found")
    }
  })

  const handleSubmit = handleForm.handleSubmit((values) => {
    if (character.data?.characterId) {
      updateHandle.mutate({
        characterId: character.data.characterId,
        handle: values.handle,
      })
    } else {
      toast.error("Failed to update handle: characterId not found")
    }
  })

  const [avatarUploading, setAvatarUploading] = useState(false)
  const [bannerUploading, setBannerUploading] = useState(false)

  useEffect(() => {
    if (character.data) {
      !handleForm.getValues("handle") &&
        handleForm.setValue("handle", character.data?.handle || "")
      !metadataForm.getValues("avatar") &&
        metadataForm.setValue(
          "avatar",
          toIPFS(character.data?.metadata?.content?.avatars?.[0] || ""),
        )
      !metadataForm.getValues("banner") &&
        metadataForm.setValue(
          "banner",
          character.data?.metadata?.content?.banners?.[0]
            ? {
                address: toIPFS(
                  character.data?.metadata?.content?.banners?.[0].address || "",
                ),
                mime_type:
                  character.data?.metadata?.content?.banners?.[0].mime_type,
              }
            : undefined,
        )
      !metadataForm.getValues("name") &&
        metadataForm.setValue(
          "name",
          character.data?.metadata?.content?.name || "",
        )
      !metadataForm.getValues("bio") &&
        metadataForm.setValue(
          "bio",
          character.data?.metadata?.content?.bio || "",
        )
    }
  }, [character.data, metadataForm, handleForm])

  useEffect(() => {
    if (updateHandle.isSuccess) {
      toast.success("Handle updated.")
      router.replace(`/${handleForm.getValues("handle")}/edit`)
      updateHandle.reset()
    } else if (updateHandle.isError) {
      toast.error("Failed to update handle.")
      updateHandle.reset()
    }
  }, [updateHandle, handleForm, router])

  useEffect(() => {
    if (updateCharacter.isSuccess) {
      toast.success("Character updated.")
      updateCharacter.reset()
    } else if (updateCharacter.isError) {
      toast.error("Failed to update character.")
      updateCharacter.reset()
    }
  }, [updateCharacter])

  useEffect(() => {
    if (setPrimaryCharacter.isSuccess) {
      toast.success("Primary status set.")
      setPrimaryCharacter.reset()
    } else if (setPrimaryCharacter.isError) {
      toast.error("Failed to set primary status.")
      setPrimaryCharacter.reset()
    }
  }, [setPrimaryCharacter])

  return (
    <div className="relative flex flex-col items-center min-h-screen py-20">
      <Head>
        <title>Editing @{handle}</title>
        <link
          rel="icon"
          href={toGateway(
            character.data?.metadata?.content?.avatars?.[0] || "/favicon.ico",
          )}
        />
      </Head>
      <div className="fixed left-1/2 -translate-x-1/2 top-14 w-[1000px] h-[272px]">
        <Image
          alt="xChar"
          src="/logos/xchar.svg"
          width={1000}
          height={272}
          priority
        />
      </div>
      <div className="w-[800px] mx-auto relative p-8 rounded-3xl text-gray-600 border-2 border-gray-50 overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white to-gray-200 opacity-80"></div>
        <h1 className="relative font-medium text-2xl">Editing @{handle}</h1>
        <h2 className="relative font-medium text-xl mt-5">📇 Metadata</h2>
        <form onSubmit={metadataSubmit} className="relative">
          <div className="mt-5">
            <label htmlFor="avatar" className="form-label">
              Avatar
            </label>
            <Controller
              name="avatar"
              control={metadataForm.control}
              render={({ field }) => (
                <ImageUploader
                  id="avatar"
                  className="w-24 h-24 rounded-full"
                  uploadStart={() => {
                    setAvatarUploading(true)
                  }}
                  uploadEnd={(key) => {
                    metadataForm.setValue("avatar", key as string)
                    setAvatarUploading(false)
                  }}
                  {...field}
                />
              )}
            />
          </div>
          <div className="mt-5">
            <label htmlFor="banner" className="form-label">
              Banner
            </label>
            <Controller
              name="banner"
              control={metadataForm.control}
              render={({ field }) => (
                <ImageUploader
                  id="banner"
                  className="max-w-screen-md h-[220px]"
                  uploadStart={() => {
                    setBannerUploading(true)
                  }}
                  uploadEnd={(key) => {
                    metadataForm.setValue(
                      "banner",
                      key as { address: string; mime_type: string },
                    )
                    setBannerUploading(false)
                  }}
                  withMimeType={true}
                  hasClose={true}
                  {...(field as any)}
                />
              )}
            />
            <div className="text-xs text-gray-400 mt-1">
              Supports both pictures and videos.
            </div>
          </div>
          <div className="mt-5">
            <Input
              required
              label="Name"
              id="name"
              {...metadataForm.register("name")}
            />
          </div>
          <div className="mt-5">
            <label htmlFor="bio" className="form-label">
              Bio
            </label>
            <Input
              multiline
              id="bio"
              className="input is-block"
              rows={2}
              {...metadataForm.register("bio")}
            />
          </div>
          <div className="mt-5">
            <Button
              type="submit"
              isLoading={updateCharacter.isLoading}
              isDisabled={avatarUploading || bannerUploading}
              rounded="full"
            >
              Save
            </Button>
          </div>
        </form>
        <h2 className="relative font-medium text-xl pt-5 mt-5 border-t border-t-zinc-300">
          🦄 Handle
        </h2>
        <form onSubmit={handleSubmit} className="relative">
          <div className="mt-5">
            <Input required id="handle" {...handleForm.register("handle")} />
          </div>
          <div className="mt-5">
            <Button
              type="submit"
              isLoading={updateHandle.isLoading}
              rounded="full"
            >
              Save
            </Button>
          </div>
        </form>
        <h2 className="relative font-medium text-xl pt-5 mt-5 border-t border-t-zinc-300">
          🌟 Primary
        </h2>
        <div className="relative text-sm text-zinc-500 my-2">
          <p>Each address can only have one primary character.</p>
          {character.data?.primary && (
            <p className="mt-1">
              The current character is already a primary character.
            </p>
          )}
        </div>
        <Button
          className="mt-2 relative"
          rounded="full"
          isLoading={setPrimaryCharacter.isLoading}
          isDisabled={character.data?.primary}
          onClick={() =>
            character.data?.characterId &&
            setPrimaryCharacter.mutate(character.data?.characterId)
          }
        >
          Set as primary
        </Button>
      </div>
    </div>
  )
}
