import { API_URL } from "@/lib/constants";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaYoutube, FaTimes, FaTrophy } from "react-icons/fa";
import { Loading } from "../Loading";
import { epochSecondsToTime, formatEpochSecondsToDate } from "@/utils/time";
import { EventDisplay } from "./displays/Event";
import { TeamDisplay } from "./displays/Team";

export const newText = [
  {
    name: "f",
    new: "Final",
  },
  {
    name: "sf",
    new: "Semi Final",
  },
  {
    name: "qf",
    new: "Quarter Final",
  },
  {
    name: "qm",
    new: "Qualification",
  },
];

const MatchHeader = (props: any) => {
  return (
    <tr>
      <td colSpan={props.isTeam ? 7 : 5} className="pt-6 px-4">
        <h1 className="font-bold bg-card py-5 px-5 rounded-t-lg text-left md:text-center border border-b-transparent border-[#2A2A2A]">
          {props.title}
        </h1>
      </td>
    </tr>
  );
};

const EventList = (props: any) => {
  if (!props.epas) return <Loading />;

  if (props.isTeam) {
    return (
      <TeamDisplay
        match={props.match}
        didWeWin={props.didWeWin}
        findAlliances={props.findAlliances}
        search_array={props.search_array}
        isTeam={props.isTeam}
        team={props.team}
      />
    );
  } else {
    return (
      <EventDisplay
        match={props.match}
        didWeWin={props.didWeWin}
        findAlliances={props.findAlliances}
        search_array={props.search_array}
        isTeam={props.isTeam}
        epas={props.matchEPAs}
        team={props.team}
      />
    );
  }
};

export const EventData = (props: any) => {
  const [isClient, setIsClient] = useState(false);
  const [matchEPAs, setMatchEPAs] = useState([]);

  function search_array(array: any, valuetofind: any) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].name == valuetofind) {
        return array[i].new;
      }
    }
  }

  useEffect(() => {
    setIsClient(true);

    const fetchEPAs = async () => {
      const matches: any = {};

      await Promise.all(
        props.data.map(async (match: any) => {
          const data = await fetch(
            `${API_URL}/api/match/epa?match=${match.key}`
          ).then((res) => res.json());
          matches[match.key] = data;
        })
      );

      setMatchEPAs(matches);
    };

    fetchEPAs();
  }, [props.data]);

  const findAlliances = (match: any) => {
    if (match.alliances.blue.team_keys.includes(`frc${props.team}`)) {
      return {
        teams: match.alliances.blue.team_keys.map((team: any) =>
          team.substring(3)
        ),
        alliance: "Blue",
      };
    } else {
      return {
        teams: match.alliances.red.team_keys.map((team: any) =>
          team.substring(3)
        ),
        alliance: "Red",
      };
    }
  };

  const didWeWin = (match: any) => {
    if (
      match.score_breakdown &&
      findAlliances(match).alliance.toLowerCase() === match.winning_alliance
    ) {
      return "win";
    } else if (!match.score_breakdown) {
      return "unknown";
    } else {
      return "lose";
    }
  };

  if (!matchEPAs) {
    return <Loading />;
  }

  return (
    <>
      {isClient && (
        <div className="relative overflow-x-auto">
          <div className="flex flex-col md:flex-row gap-3 w-full mt-3 md:mt-5 whitespace-nowrap">
            {props.isTeam &&
              props.playlists[props.event.event_code].length > 0 && (
                <div className="border border-[#2a2a2a] bg-[#191919] text-red-500 px-5 py-3 rounded-lg">
                  <a
                    href={`https://youtube.com/watch_videos?video_ids=${props.playlists[
                      props.event.event_code
                    ].join(",")}&title=${props.event.name}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <FaYoutube className="mr-1 inline-block text-xl mb-[3px]" />{" "}
                    Watch All Matches
                  </a>
                </div>
              )}
            <div className="border border-[#2a2a2a] bg-[#191919] text-lightGray px-5 py-3 rounded-lg w-full">
              <span className="text-green-400">Win</span> /{" "}
              <span className="text-red-400">Loss</span> /{" "}
              <span className="text-lightGray">Unknown</span> /{" "}
              <span className="text-red-400 line-through">Disqualified</span> /{" "}
              <span className="text-red-400">
                <div className="bg-red-400 h-3 w-2 inline-block ml-1"></div> Red
                Card
              </span>{" "}
              /{" "}
              <span className="text-lightGray underline decoration-dotted">
                Surrogate Team
              </span>
            </div>
          </div>

          <table className="w-full mt-5 text-sm text-left bg-[#191919] border border-[#2A2A2A]">
            <thead className="text-xs text-white uppercase">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Video
                </th>
                <th scope="col" className="px-6 py-3">
                  Match #
                </th>
                {props.isTeam ? (
                  <>
                    <th scope="col" className="px-6 py-3">
                      Alliance
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Win / Loss
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Team Score
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Opposing Alliance
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Opposing Alliance Score
                    </th>
                  </>
                ) : (
                  <>
                    <th scope="col" className="px-6 py-3">
                      Score
                    </th>
                    <th scope="col" className="px-6 py-3 text-red-400">
                      Red Alliance
                    </th>
                    <th scope="col" className="px-6 py-3 text-sky-400">
                      Blue Alliance
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {props.data?.filter((match: any) => match.comp_level === "f")
                .length > 0 && (
                <MatchHeader title="Finals" isTeam={props.isTeam} />
              )}

              {props.data
                ?.filter((match: any) => match.comp_level === "f")
                .reverse()
                .map((match: any, key: number) => {
                  return (
                    <EventList
                      match={match}
                      didWeWin={() => didWeWin(match)}
                      findAlliances={() => findAlliances(match)}
                      search_array={search_array}
                      key={key}
                      isTeam={props.isTeam}
                      epas={matchEPAs}
                      team={props.team}
                    />
                  );
                })}

              {props.data?.filter(
                (match: any) =>
                  match.comp_level === "sf" || match.comp_level === "qf"
              ).length > 0 && (
                <MatchHeader
                  title="Semi Finals / Quarter Finals"
                  isTeam={props.isTeam}
                />
              )}

              {props.data
                ?.filter(
                  (match: any) =>
                    match.comp_level === "sf" || match.comp_level === "qf"
                )
                .sort((matchA: any, matchB: any) => {
                  if (matchA.comp_level === matchB.comp_level) {
                    if (
                      parseInt(matchA.set_number) ===
                      parseInt(matchB.set_number)
                    ) {
                      return (
                        parseInt(matchB.match_number) -
                        parseInt(matchA.match_number)
                      );
                    } else {
                      return (
                        parseInt(matchB.set_number) -
                        parseInt(matchA.set_number)
                      );
                    }
                  } else if (matchA.comp_level === "sf") {
                    return -1;
                  } else if (matchB.comp_level === "sf") {
                    return 1;
                  }
                })
                .map((match: any, key: number) => {
                  return (
                    <EventList
                      match={match}
                      didWeWin={() => didWeWin(match)}
                      findAlliances={() => findAlliances(match)}
                      search_array={search_array}
                      key={key}
                      isTeam={props.isTeam}
                      epas={matchEPAs}
                      team={props.team}
                    />
                  );
                })}

              {props.data?.filter((match: any) => match.comp_level === "qm")
                .length > 0 && (
                <MatchHeader
                  title="Qualification Matches"
                  isTeam={props.isTeam}
                />
              )}

              {props.data
                ?.filter((match: any) => match.comp_level === "qm")
                .sort(
                  (matchA: any, matchB: any) =>
                    parseInt(matchB.match_number) -
                    parseInt(matchA.match_number)
                )
                .map((match: any, key: number) => {
                  return (
                    <EventList
                      match={match}
                      didWeWin={() => didWeWin(match)}
                      findAlliances={() => findAlliances(match)}
                      search_array={search_array}
                      key={key}
                      isTeam={props.isTeam}
                      epas={matchEPAs}
                      team={props.team}
                    />
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};