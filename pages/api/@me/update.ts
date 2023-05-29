import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import db from "@/lib/db";

export default async function UpdateUser(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const session: Session = (await getServerSession(
    req,
    res,
    authOptions
  )) as Session;

  if (!session) res.status(400).send("You are not logged in!");

  if (req.method === "POST") {
    const body = JSON.parse(req.body);

    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        ...body,
      },
    });

    res.status(200).send("Successfully updated user");
  }
}
