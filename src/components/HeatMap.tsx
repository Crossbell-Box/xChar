import { useGetCalendar } from "../queries/character"
import dayjs from "dayjs"
import { Tooltip } from "./Tooltip"

export const HeatMap: React.FC<{
  characterId?: number
}> = ({ characterId }) => {
  const calendar = useGetCalendar(characterId || 0)

  return (
    <div>
      <div className="flex sm:gap-1 gap-[2px]">
        {calendar.data?.calendar.map((week: any, index: number) => (
          <div className="flex sm:gap-1 gap-[2px] flex-col" key={index}>
            {week.map((day: any) => (
              <Tooltip
                key={day.day}
                label={
                  day.count +
                  " notes on " +
                  dayjs(day.day).format("MMM DD, YYYY")
                }
                placement="top"
              >
                <div
                  className={
                    "sm:w-[10px] sm:h-[10px] w-1 h-1 cursor-pointer sm:rounded-sm rounded-[1px] " +
                    (day.count === 0
                      ? "bg-gray-100"
                      : day.count > 0 && day.count < 2
                      ? "bg-calendar-L1"
                      : day.count >= 2 && day.count < 5
                      ? "bg-calendar-L2"
                      : day.count >= 5 && day.count < 10
                      ? "bg-calendar-L3"
                      : "bg-calendar-L4")
                  }
                ></div>
              </Tooltip>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
