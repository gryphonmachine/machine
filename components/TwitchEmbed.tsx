import { dev } from "@/lib/constants";
import React from "react";

interface Props {
  channel: string;
}

export const TwitchEmbed = (props: Props) => {
  return (
    <iframe
      src={`https://player.twitch.tv/?channel=${props.channel}&parent=${
        dev ? "localhost" : "scoutmachine.io"
      }&muted=true`}
      className="rounded-lg border border-[#2A2A2A] bg-card hover:border-gray-600 px-2 py-3 max-w-full h-64 max-h-[500px]"
    ></iframe>
  );
};
