import { NextApiRequest, NextApiResponse } from "next"
import { getNotes } from "~/models/character"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const query = req.query

  const result = await getNotes({
    characterId: Number(query.characterId),
    limit: query.limit ? parseInt(query.limit as string) : undefined,
    cursor: query.cursor as string,
    sources: query.sources ? (query.sources as string).split(",") : undefined,
  })

  res.status(200).json(result)
}
