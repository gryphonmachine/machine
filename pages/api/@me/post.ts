import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import db from "@/lib/db";
import { Post } from ".prisma/client";

export default async function marketplaceAPI(
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

    const post: Post = await db.post.create({
      data: {
        // @ts-ignore
        authorId: session.user?.id,
        title: body.title,
        content: body.content,
        type: body.type,
        currencyType: body.currencyType as string,
        published: false,
        price: Number(body.price),
        formattedAddress: body.formattedAddress,
        latitude: parseFloat(body.latitude),
        longitude: parseFloat(body.longitude),
        imageUrl: (body.imageUrl as string) || "",
      },
    });

    res.status(200).send(post);
  }

  if (req.method === "DELETE") {
    const { id } = req.query;

    await db.post.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).send("Successfully deleted post");
  }

  res.status(400).send("Method not allowed");
}
