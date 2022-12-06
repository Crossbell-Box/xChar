import { useGetCharacter, useUpdateCharacter } from "~/queries/character"
import { useAccount } from "wagmi"
import { useRouter } from "next/router"
import { Image } from "~/components/ui/Image"
import { Avatar } from "~/components/ui/Avatar"
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

  const form = useForm({
    defaultValues: {
      handle: "",
      avatar: "",
      banner: undefined,
      name: "",
      bio: "",
    } as {
      handle: string
      avatar: string
      banner?: {
        address: string
        mime_type: string
      }
      name: string
      bio: string
    },
  })

  const handleSubmit = form.handleSubmit((values) => {
    if (character.data?.characterId) {
      updateCharacter.mutate({
        characterId: character.data.characterId,
        ...(values.handle !== handle && { handle: values.handle }),
        avatar: values.avatar,
        banner: values.banner,
        name: values.name,
        bio: values.bio,
      })
    } else {
      toast.error("Failed to update character: characterId not found")
    }
  })

  const [avatarUploading, setAvatarUploading] = useState(false)
  const [bannerUploading, setBannerUploading] = useState(false)

  useEffect(() => {
    if (character.data) {
      !form.getValues("avatar") &&
        form.setValue(
          "avatar",
          toIPFS(character.data?.metadata?.content?.avatars?.[0] || ""),
        )
      !form.getValues("banner") &&
        form.setValue(
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
      !form.getValues("name") &&
        form.setValue("name", character.data?.metadata?.content?.name || "")
      !form.getValues("bio") &&
        form.setValue("bio", character.data?.metadata?.content?.bio || "")
    }
  }, [character.data, form])

  return (
    <div className="relative flex flex-col items-center min-h-screen py-20">
      <Head>
        <title>
          Editing{" "}
          {character.data?.metadata?.content?.name || character.data?.handle}
        </title>
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
          src="/logos/crossbell.svg"
          width={1000}
          height={272}
          priority
        />
      </div>
      <div className="w-[800px] mx-auto relative p-8 rounded-3xl text-gray-600 border-2 border-gray-50 overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white to-gray-200 opacity-80"></div>
        <div className="relative font-medium text-2xl">Editing @{handle}</div>
        <form onSubmit={handleSubmit} className="relative">
          <div className="mt-5">
            <label htmlFor="avatar" className="form-label">
              Avatar
            </label>
            <Controller
              name="avatar"
              control={form.control}
              render={({ field }) => (
                <ImageUploader
                  id="avatar"
                  className="w-24 h-24 rounded-full"
                  uploadStart={() => {
                    setAvatarUploading(true)
                  }}
                  uploadEnd={(key) => {
                    form.setValue("avatar", key as string)
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
              control={form.control}
              render={({ field }) => (
                <ImageUploader
                  id="banner"
                  className="max-w-screen-md h-[220px]"
                  uploadStart={() => {
                    setBannerUploading(true)
                  }}
                  uploadEnd={(key) => {
                    form.setValue(
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
            <Input required label="Name" id="name" {...form.register("name")} />
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
              {...form.register("bio")}
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
      </div>
    </div>
  )
}
