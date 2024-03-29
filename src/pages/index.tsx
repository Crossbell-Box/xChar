import Head from "next/head"
import { Image } from "~/components/ui/Image"
import React, { useState, useMemo } from "react"
import { indexer } from "@crossbell/indexer"
import { useCombobox } from "downshift"
import { Input } from "../components/ui/Input"
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid"
import type { CharacterEntity } from "crossbell"
import { debounce } from "underscore"
import Router from "next/router"
import { Avatar } from "~/components/ui/Avatar"
import { UniLink } from "~/components/ui/UniLink"

export default function Home() {
  const [items, setItems] = useState<CharacterEntity[]>([])

  const searchChar = useMemo(() => {
    return debounce(async (inputValue: string) => {
      const result = await indexer.search.characters(inputValue, {
        limit: 8,
      })
      setItems(result.list)
    }, 300)
  }, [])

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    inputValue,
  } = useCombobox({
    async onInputValueChange({ inputValue }) {
      if (!inputValue || inputValue.length < 3) {
        setItems([])
      } else {
        searchChar(inputValue)
      }
    },
    items,
    itemToString(item) {
      return item ? item.handle : ""
    },
    onSelectedItemChange({ selectedItem }) {
      if (selectedItem) {
        Router.push(`/${selectedItem?.handle}`)
      }
    },
    defaultHighlightedIndex: 0,
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>xChar</title>
        <meta name="description" content="Characters on Crossbell" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex-1 flex flex-col justify-center items-center">
        <div className="relative">
          <div className="absolute bottom-full mb-10 w-full flex justify-center flex-col text-center">
            <h1>
              <Image
                alt="xChar"
                src="/logos/xchar.svg"
                width={212.5}
                height={235}
                priority
              />
            </h1>
            <div className="font-medium mt-2">Characters on Crossbell</div>
          </div>
          <div className="h-10 w-[580px]">
            <div
              className={`relative border-gray-300 border rounded-[20px] overflow-hidden hover:border-[#dfe1e5] hover:shadow-search ${
                isOpen && items.length ? "border-[#dfe1e5] shadow-search" : ""
              }`}
            >
              <Input
                className="w-full focus:border-gray-300 focus:ring-0 border-0 rounded-none"
                prefixEle={
                  <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
                }
                {...getInputProps({
                  onKeyDown: ((event) => {
                    if (event.key === "Enter" && !items.length) {
                      Router.push(`/${inputValue}`)
                    }
                  }) as React.KeyboardEventHandler<HTMLInputElement>,
                })}
              />
              <>
                {isOpen && !!items.length && (
                  <div className="border-t mx-5 border-gray-300"></div>
                )}
                <ul
                  {...getMenuProps()}
                  className={`left-0 top-full w-full bg-white ${
                    isOpen && items.length ? "py-3" : ""
                  }`}
                >
                  {isOpen && items.length
                    ? items.map((item, index) => (
                        <li
                          key={item.handle}
                          {...getItemProps({
                            index,
                            item,
                            className: `${
                              highlightedIndex === index ? "bg-gray-100" : ""
                            } px-4 py-2 cursor-pointer flex items-center`,
                          })}
                        >
                          <span className="inline-block w-7 h-7 overflow-hidden rounded-full mr-2">
                            <Avatar
                              size={28}
                              images={item.metadata?.content?.avatars || []}
                              name={item.handle}
                            />
                          </span>
                          <span>
                            <span className="mr-1">
                              {item.metadata?.content?.name}
                            </span>
                            <span className="text-zinc-500">
                              @{item.handle}
                            </span>
                          </span>
                        </li>
                      ))
                    : null}
                </ul>
              </>
            </div>
          </div>
        </div>
      </main>

      <footer className="h-12 text-center text-zinc-400">
        Made with ❤️ by{" "}
        <UniLink href="https://crossbell.io/">🔔 Crossbell Team</UniLink>
      </footer>
    </div>
  )
}
