import { NextApiRequest, NextApiResponse } from "next"
import { getCalendar } from "~/lib/calendar"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const query = req.query

  res.status(200).json(await getCalendar(Number(query.characterId)))
}
