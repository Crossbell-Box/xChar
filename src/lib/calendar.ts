import dayjs from "dayjs"
import dayOfYear from "dayjs/plugin/dayOfYear"
import weekOfYear from "dayjs/plugin/weekOfYear"
import advancedFormat from "dayjs/plugin/advancedFormat"
import type { NoteEntity, ListResponse } from "crossbell.js"
import { cacheGet } from "~/lib/redis.server"
import * as characterModel from "~/models/character"

dayjs.extend(dayOfYear)
dayjs.extend(weekOfYear)
dayjs.extend(advancedFormat)

const calendarLength = 370

const format = (day: dayjs.Dayjs) => {
  const ww = day.format("ww")
  const mm = day.format("MM")
  if (ww === "01" && mm !== "01") {
    return `${day.year() + 1}-${ww}`
  } else {
    return `${day.year()}-${ww}`
  }
}

const getCalendarTemp = () => {
  const calendar: {
    [key: string]: {
      day: dayjs.Dayjs
      count: number
    }[]
  } = {}
  for (let i = calendarLength - 1; i >= 0; i--) {
    const day = dayjs().subtract(i, "day")
    let week = format(day)
    if (!calendar[week]) {
      calendar[week] = []
    }
    calendar[week].push({
      day: day,
      count: 0,
    })
  }
  return calendar
}

export const getCalendar = async (characterId: number) => {
  let cursor
  let notes: NoteEntity[] = []
  let currentList: NoteEntity[] = []
  do {
    const options = {
      characterId: Number(characterId),
      limit: 50,
      ...(cursor ? { cursor } : {}),
    }
    const noteList: ListResponse<NoteEntity> = await cacheGet(
      ["getNotes", options.characterId, options],
      () => characterModel.getNotes(options),
      !!options.cursor,
    )

    currentList = noteList.list.filter((note) => {
      return (
        dayjs()
          .startOf("day")
          .diff(dayjs(note.createdAt).startOf("day"), "day") < calendarLength
      )
    })
    notes = notes.concat(currentList)
    cursor = noteList.cursor
  } while (cursor && currentList.length)

  let response = {
    calendar: getCalendarTemp(),
    count: 0,
  }

  for (let i = 0; i < notes.length; i++) {
    const day = dayjs(notes[i].createdAt)
    let week = format(day)
    const today = response.calendar[week].find((item: any) =>
      item.day.isSame(day, "day"),
    )
    if (today) {
      today.count++
      response.count++
    } else {
      console.warn("not found", day)
    }
  }

  return {
    calendar: Object.keys(response.calendar)
      .sort()
      .map((key) =>
        response.calendar[key].map((item: any) => {
          item.day = item.day.toString()
          return item
        }),
      ),
    count: response.count,
  }
}
