import type { NoteEntity } from "crossbell"

export type Note = NoteEntity & {
  cover?: string
  metadata?: {
    content?: {
      summary?: string
    } | null
  } | null
}

export type Notes = {
  count: number
  list: Note[]
  cursor?: string
}
