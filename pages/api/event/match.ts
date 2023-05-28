import { NextApiRequest, NextApiResponse } from "next";
import { fetchTBA } from "@/lib/fetchTBA";
import db from "@/lib/db";
import { Match } from "@prisma/client";

export default async function getEventRankings(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { match } = req.query;

  const matchData: Match | null = await db.match.findFirst({
    where: {
      key: String(match),
    },
  });

  if (!matchData) {
    const fetchMatchData: any = await fetchTBA(`match/${String(match)}`);
    if (!fetchMatchData) res.status(400).send("Invalid Match");

    const createdMatchData: Match = await db.match.create({
      data: {
        ...fetchMatchData,
      },
    });

    res.status(200).send(createdMatchData);
  }

  res.status(200).send(matchData);
}
