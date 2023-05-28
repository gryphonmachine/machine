import { NextApiRequest, NextApiResponse } from "next";
import { fetchFIRST } from "@/lib/fetchFIRST";

export const fetchTeamAvatar = async (
  req: NextApiRequest
): Promise<
  | { avatar: null; status: any }
  | { avatar: any; status: any }
  | { avatar: null; status: number }
> => {
  try {
    const { team } = req.query;
    const response: any = await fetchFIRST(`/avatars?teamNumber=${team}`);

    if (response.status < 200 || response.status >= 300) {
      return { avatar: null, status: response.status };
    }

    return {
      avatar:
        response.teams.length > 0 ? response.teams[0].encodedAvatar : null,
      status: response.status,
    };
  } catch (e) {
    return { avatar: null, status: 500 };
  }
};

export default async function getTeamAvatar(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { avatar } = await fetchTeamAvatar(req);
  res.status(200).send({ avatar });
}
