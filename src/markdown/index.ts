import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import remarkFrontmatter from "remark-frontmatter"
import rehypeStringify from "rehype-stringify"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"
import rehypeSanitize from "rehype-sanitize"
import rehypeRaw from "rehype-raw"
import { refractor } from "refractor"
import rehypePrismGenerator from "rehype-prism-plus/generator"
import { rehypeImage } from "./rehype-image"
import { rehypeTable } from "./rehype-table"
import { remarkCallout } from "./remark-callout"
import { rehypeExternalLink } from "./rehyper-external-link"
import { rehypeWrapCode } from "./rehype-wrap-code"
import jsYaml from "js-yaml"
import rehypeReact from "rehype-react"
import { createElement, ReactElement } from "react"
import { Image } from "~/components/ui/Image"
import remarkDirective from "remark-directive"
import remarkDirectiveRehype from "remark-directive-rehype"
import { remarkYoutube } from "./remark-youtube"
import sanitizeScheme from "./sanitize-schema"
import type { Root } from "hast"
import rehypeInferDescriptionMeta from "rehype-infer-description-meta"

export type MarkdownEnv = {
  excerpt: string
  frontMatter: Record<string, any>
  __internal: Record<string, any>
  cover: string
  tree: Root | null
}

export type Rendered = {
  contentHTML: string
  element?: ReactElement
  excerpt: string
  frontMatter: Record<string, any>
  cover: string
  tree: Root | null
}

refractor.alias("html", ["svelte", "vue"])

const rehypePrism = rehypePrismGenerator(refractor)

export const renderPageContent = (
  content: string,
  html?: boolean,
): Rendered => {
  const env: MarkdownEnv = {
    excerpt: "",
    __internal: {},
    frontMatter: {},
    cover: "",
    tree: null,
  }

  let contentHTML = ""
  let result: any = null
  try {
    result = unified()
      .use(remarkParse)
      .use(remarkBreaks)
      .use(remarkFrontmatter, ["yaml"])
      .use(() => (tree: Root) => {
        const yaml = tree.children.find((node) => (node as any).type === "yaml")
        if ((yaml as any)?.value) {
          try {
            env.frontMatter = jsYaml.load((yaml as any)?.value) as Record<
              string,
              any
            >
          } catch (e) {
            console.error(e)
          }
        }
      })
      .use(remarkGfm, {
        singleTilde: false,
      })
      .use(remarkCallout)
      .use(remarkDirective)
      .use(remarkDirectiveRehype)
      .use(remarkYoutube)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeStringify)
      .use(rehypeRaw)
      .use(rehypeImage, { env })
      .use(rehypeSanitize, sanitizeScheme)
      .use(rehypePrism, {
        ignoreMissing: true,
        showLineNumbers: true,
      })
      .use(rehypeTable)
      .use(rehypeExternalLink)
      .use(rehypeWrapCode)
      .use(rehypeInferDescriptionMeta, {
        truncateSize: 280,
      })
      .use(html ? () => (tree: any) => {} : rehypeReact, {
        createElement: createElement,
        components: {
          img: Image,
        } as any,
      })
      .use(() => (tree: Root) => {
        env.tree = tree
      })
      .processSync(content)

    contentHTML = result.toString()
  } catch (error) {
    console.error(error)
  }
  return {
    contentHTML,
    element: result?.result,
    excerpt: result?.data.meta.description,
    frontMatter: env.frontMatter,
    cover: env.cover,
    tree: env.tree,
  }
}
