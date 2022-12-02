import { NextApiRequest, NextApiResponse } from "next"
import { getPagesBySite } from "~/models/character"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const query = req.query

  const result = await getPagesBySite({
    characterId: Number(query.characterId),
    limit: query.limit ? parseInt(query.limit as string) : undefined,
    cursor: query.cursor as string,
  })

  res.status(200).json(result)
}
