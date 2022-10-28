import { useGetNotes } from "../queries/character"
import dayjs from 'dayjs'
import dayOfYear from 'dayjs/plugin/dayOfYear'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { useState, useEffect } from "react"

dayjs.extend(dayOfYear)
dayjs.extend(weekOfYear)

export const HeatMap: React.FC<{
  characterId?: number
}> = ({ characterId }) => {
  const notes = useGetNotes(characterId || 0)

  const getYearCalendar = (year: number) => {
    const length = year % 4 === 0 ? 366 : 365;
    const calendar: any = [];
    for (let i = 1; i < length + 1; i++) {
      const day = dayjs(year + '').dayOfYear(i);
      if (day.diff(dayjs()) > 0) {
        break;
      }
      let week = day.week();
      if (i > 7 && week === 1) {
        if (calendar[calendar.length - 1].length === 7) {
          week = calendar.length + 1;
        } else {
          week = calendar.length;
        }
      }
      if (!calendar[week - 1]) {
        calendar[week - 1] = [];
      }
      calendar[week - 1].push({
        dayjs: day,
        count: 0,
      });
    }
    return calendar;
  };

  const currentYear = dayjs().year();

  const [calendar, setCalendar] = useState({
    year: currentYear,
    calendar: getYearCalendar(currentYear),
    count: 0,
  });

  useEffect(() => {
    if (notes.data && notes.data.list && !calendar.count) {
      for (let i = 0; i < notes.data.list.length; i++) {
        const day = dayjs(notes.data.list[i].createdAt);
        let week = day.week();
        if (day.year() === currentYear) {
          const list = calendar.calendar;
          if (day.dayOfYear() > 7 && week === 1) {
            if (list[list.length - 1].length === 7) {
              week = list.length + 1;
            } else {
              week = list.length;
            }
          }
          const result = list[week - 1].find((item: any) => item.dayjs.isSame(day, 'day'))
          result.count++;
          calendar.count++;
          setCalendar({
            ...calendar,
            calendar: list,
          });
        }
      }
    }
  }, [notes.data])

  return (
    <div>
      <div className="flex gap-1">
        {calendar.calendar.map((week: any, index: number) => (
          <div className="flex gap-1 flex-col" key={index}>
            {week.map((day: any) => (
              <div key={day.dayjs.toString()} className={"w-2 h-2 bg-gray-200 cursor-pointer " + (day.count === 0 ? "bg-gray-200" : (day.count > 0 && day.count < 2 ? "bg-blue-200" : (day.count >= 2 && day.count < 5 ? "bg-blue-400" : (day.count >= 5 && day.count < 10 ? "bg-blue-600" : "bg-blue-900"))))}></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
