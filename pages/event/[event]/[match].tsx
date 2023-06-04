import { Navbar } from "@/components/navbar";
import db from "@/lib/db";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { JSX } from "react";
import { Match } from "@prisma/client";
import { SEO } from "@/components/SEO";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaCube, FaTrophy } from "react-icons/fa";
import { BsCone, BsDot } from "react-icons/bs";
import { Footer } from "@/components/Footer";

const AllianceComponent = ({ match, teams }: any) => {
  return (
    <div className="flex flex-col md:grid md:grid-cols-2 gap-3">
      <div className="bg-red-500 rounded-md p-5">
        <h1 className="text-3xl font-bold mb-4 text-red-200 text-center">
          Red Alliance{" "}
          <button className="cursor-default bg-red-600 rounded-lg text-sm align-middle py-1 px-3 text-white">
            <span className="flex">
              {match.alliances.red.score} pts{" "}
              {match.winning_alliance === "red" && (
                <FaTrophy className="mt-1 ml-1" />
              )}
            </span>
          </button>
        </h1>

        <div className="flex flex-col md:grid md:grid-cols-3 gap-3">
          {match.alliances.red.team_keys.map((team: any, key: number) => {
            return (
              <Link key={key} href={`/team/${team}`}>
                <div className={`bg-red-400 hover:bg-red-600 rounded-lg py-5`}>
                  <p className="text-center text-sm font-semibold text-red-200 mb-1">
                    {teams[team.substring(3)].nickname}
                  </p>
                  <h1
                    className={`text-xl flex items-center justify-center font-bold text-white`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="rounded-lg mr-4 w-7"
                      alt={`Team ${team.substring(3)} Avatar`}
                      height="50"
                      width="50"
                      src={`http://localhost:3000/api/og/avatar?team=${team.substring(
                        3
                      )}`}
                    />
                    Team {team.substring(3)}
                  </h1>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="bg-sky-500 rounded-md p-5">
        <h1 className="text-3xl font-bold mb-4 text-sky-200 text-center">
          Blue Alliance{" "}
          <button className="cursor-default bg-sky-600 rounded-lg text-sm align-middle py-1 px-3 text-white">
            <span className="flex">
              {match.alliances.blue.score} pts{" "}
              {match.winning_alliance === "blue" && (
                <FaTrophy className="mt-1 ml-1" />
              )}
            </span>
          </button>
        </h1>

        <div className="flex flex-col md:grid md:grid-cols-3 gap-3">
          {match.alliances.blue.team_keys.map((team: any, key: number) => {
            return (
              <Link key={key} href={`/team/${team.substring(3)}`}>
                <div className={`bg-sky-400 hover:bg-sky-600 rounded-lg py-5`}>
                  <p className="text-center text-sm font-semibold text-sky-200 mb-1">
                    {teams[team.substring(3)].nickname}
                  </p>
                  <h1
                    className={`text-xl flex items-center justify-center ${
                      team.surrogate ? "text-lightGray" : "text-white"
                    } font-bold`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="rounded-lg mr-4 w-7"
                      alt={`Team ${team} Avatar`}
                      height="50"
                      width="50"
                      src={`http://localhost:3000/api/og/avatar?team=${team.substring(
                        3
                      )}`}
                    />
                    Team {team.substring(3)}
                  </h1>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const BoxRow = ({ alliance, scoringData, level, links, autoData }: any) => {
  const linkNodes = links.find((link: any) => link.row === level);
  const linkIndices = linkNodes ? linkNodes.nodes : [];
  const levelKey = level.charAt(0).toUpperCase();

  // Check if any of the boxes in the linkIndices array have a link
  const hasLinkInGroup = linkIndices.some(
    (index: number) => scoringData[index] !== "None"
  );

  const boxes = scoringData.map((item: any, index: number) => {
    const hasLink = linkIndices.includes(index);
    const isAutoScored = autoData[levelKey][index] !== "None";

    let boxClasses =
      "border-2 bg-card h-16 rounded-md flex justify-center items-center";

    if (alliance === "red" && !hasLink && !isAutoScored) {
      boxClasses += " border-red-400";
    } else if (alliance === "blue" && !hasLink && !isAutoScored) {
      boxClasses += " border-sky-400";
    } else if (hasLink && hasLinkInGroup) {
      boxClasses += " border-white";
    } else if (isAutoScored) {
      boxClasses += " border-green-400";
    }

    return (
      <div key={index} className={boxClasses}>
        {item === "Cube" ? (
          <span role="img" aria-label="cube">
            <FaCube className="text-purple-400 text-2xl" />
          </span>
        ) : item === "Cone" ? (
          <span role="img" aria-label="cone">
            <BsCone className="text-yellow-400 text-2xl" />
          </span>
        ) : (
          <span role="img" aria-label="none">
            <BsDot className="text-lightGray text-2xl" />
          </span>
        )}
      </div>
    );
  });

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-9 gap-4">
      <div className="sm:col-span-2 md:col-span-9 text-center text-lightGray font-bold">
        {level} Nodes
      </div>
      {boxes}
    </div>
  );
};

const MatchData = ({ event, breakdown }: any) => {
  const redNodes = breakdown.red.teleopCommunity;
  const blueNodes = breakdown.blue.teleopCommunity;
  const redAutoNodes = breakdown.red.autoCommunity;
  const blueAutoNodes = breakdown.blue.autoCommunity;
  const redLinks = breakdown.red.links;
  const blueLinks = breakdown.blue.links;

  switch (event.substring(0, 4)) {
    case "2023":
      return (
        <>
          <div className="relative mt-5">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#2A2A2A]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <h1 className="bg-card py-1 px-5 rounded-lg text-center text-xl text-white font-bold">
                Scoring Location Breakdown
              </h1>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {/* Top Nodes */}
            <BoxRow
              alliance="red"
              scoringData={redNodes.T}
              level="Top"
              links={redLinks}
              autoData={redAutoNodes}
            />
            <BoxRow
              alliance="blue"
              scoringData={blueNodes.T}
              level="Top"
              links={blueLinks}
              autoData={blueAutoNodes}
            />

            {/* Middle Nodes */}
            <BoxRow
              alliance="red"
              scoringData={redNodes.M}
              level="Middle"
              links={redLinks}
              autoData={redAutoNodes}
            />
            <BoxRow
              alliance="blue"
              scoringData={blueNodes.M}
              level="Middle"
              links={blueLinks}
              autoData={blueAutoNodes}
            />

            {/* Bottom Nodes */}
            <BoxRow
              alliance="red"
              scoringData={redNodes.B}
              level="Bottom"
              links={redLinks}
              autoData={redAutoNodes}
            />
            <BoxRow
              alliance="blue"
              scoringData={blueNodes.B}
              level="Bottom"
              links={blueLinks}
              autoData={blueAutoNodes}
            />
          </div>
        </>
      );

    default:
      return <></>;
  }
};

export default function MatchPage({ match, teamData }: any): JSX.Element {
  const router = useRouter();
  const { event } = router.query;
  const title: string = `Match ${match.match_number} / ${match.event_key
    .slice(4)
    .toUpperCase()} / Scout Machine`;

  console.log(match);

  return (
    <>
      <SEO title={title} />

      <Navbar />

      <div className="pr-4 pl-4 md:pr-8 md:pl-8 max-w-screen-3xl">
        <h1 className="text-white mt-10 text-5xl font-bold text-center mb-5">
          Match {match.match_number}
        </h1>
        <AllianceComponent match={match} teams={teamData} />

        <MatchData event={event} breakdown={match.score_breakdown} />
      </div>

      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<{
  props: { match: any; teamData: any };
}> => {
  const { event, match }: any = context.params;
  const teamData: any = {};

  const matchData: Match | null | any = await db.match.findUnique({
    where: {
      key: `${event}_${match}`,
    },
  });

  const redTeamPromises = matchData?.alliances.red.team_keys.map(
    async (team: any) => {
      const data = await db.team.findUnique({
        where: {
          team_number: Number(team.substring(3)),
        },
      });

      teamData[team.substring(3)] = data;
    }
  );

  const blueTeamPromises = matchData?.alliances.blue.team_keys.map(
    async (team: any) => {
      const data = await db.team.findUnique({
        where: {
          team_number: Number(team.substring(3)),
        },
      });

      teamData[team.substring(3)] = data;
    }
  );

  await Promise.all([...redTeamPromises, ...blueTeamPromises]);

  return {
    props: {
      match: JSON.parse(
        JSON.stringify(matchData, (key: string, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      ),
      teamData,
    },
  };
};
