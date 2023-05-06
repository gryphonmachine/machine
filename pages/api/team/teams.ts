import { NextApiRequest, NextApiResponse } from "next";
import { fetchTBA } from "@/lib/fetchTBA";

export default async function getTeams(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { page } = req.query;
  return await fetchTBA(res, `teams/${page}`);
}
