import { EventData } from "@/components/eventdata";
import { Footer } from "@/components/Footer";
import { TabButton } from "@/components/TabButton";
import { API_URL } from "@/lib/constants";
import { NextRouter, useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { FaArrowUp, FaTwitch } from "react-icons/fa";
import { convertDate, isLive } from "@/utils/date";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { TeamScreen } from "@/components/screens/TeamScreen";
import { AboutTab } from "@/components/tabs/team/About";
import { AwardsTab } from "@/components/tabs/team/Awards";
import Head from "next/head";
import { ErrorMessage } from "@/components/ErrorMessage";
import { getServerSession, Session, User } from "next-auth";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import db from "@/lib/db";
import { TeamMembersTab } from "@/components/tabs/team/TeamMembers";
import { EventsTab } from "@/components/tabs/team/Events";
import { FavouritedTeam } from "@prisma/client";

const SubInfo = (props: any) => {
  return (
    <span className="border border-[#2A2A2A] text-lightGray py-[3px] px-2 ml-1 rounded-full">
      {props.children}
    </span>
  );
};

export default function TeamPage({
  user,
  teamMembers,
  teamInfo,
  teamEvents,
  teamSocials,
  eventMatches,
}: any) {
  const router: NextRouter = useRouter();
  const { team } = router.query;
  const [activeTab, setActiveTab] = useState<any>(1);
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [currentYearTab, setCurrentYearTab] = useState();

  useEffect(() => {
    const redirectToHome = async () => {
      if (!teamInfo) {
        await router.push("/404");
      }
    };

    redirectToHome();
  }, [router, teamInfo]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener("click", handleOutsideClick);

    return (): void => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [dropdownRef]);

  const toggleDropdown = (): void => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleTabClick = (tabIndex: number): void => {
    setActiveTab(tabIndex);
  };

  const yearsParticipated: any = [];

  teamEvents.map((event: any) => {
    const year = event.year;
    if (yearsParticipated.indexOf(year) === -1) yearsParticipated.push(year);
  });

  const year = yearsParticipated
    ? yearsParticipated.map((year: any) => year)
    : [];

  return (
    <>
      <Head>
        <title>Team {team} | Scout Machine</title>
      </Head>

      <Navbar />

      <div className="flex flex-wrap items-center justify-center pl-4 pr-4 md:pl-0 md:pr-0">
        <TeamScreen
          team={teamInfo}
          years={yearsParticipated}
          socials={teamSocials}
          avatar={teamInfo?.teamAvatar}
          district={teamInfo?.teamDistrict}
          user={user}
        />

        <div className="md:pl-8 md:pr-8 w-full max-w-screen-3xl">
          <div className="border border-[#2a2a2a] bg-[#191919] rounded-lg px-10 py-10 flex flex-col mt-5">
            <div className="flex flex-wrap gap-4">
              <TabButton
                active={activeTab}
                tab={1}
                onClick={() => setActiveTab(1)}
              >
                About
              </TabButton>
              <TabButton
                active={activeTab}
                tab={2}
                onClick={() => setActiveTab(2)}
              >
                Awards <SubInfo>{teamInfo?.teamAwards?.length}</SubInfo>
              </TabButton>
              <TabButton
                active={activeTab}
                tab={4}
                onClick={() => setActiveTab(4)}
              >
                Events <SubInfo>{teamEvents.length}</SubInfo>
              </TabButton>
              <TabButton
                active={activeTab}
                tab={3}
                onClick={() => setActiveTab(3)}
              >
                Team Members <SubInfo>{teamMembers.length}</SubInfo>
              </TabButton>
              <div className="relative" ref={dropdownRef}>
                <div
                  className={`group bg-card border border-[#2A2A2A] w-[300px] text-white  ${
                    isDropdownOpen
                      ? "rounded-t-lg border-2 border-b-[#2A2A2A] border-transparent"
                      : "rounded-lg border-b-[5px] border-[#2A2A2A]"
                  } px-5 py-2 flex items-center justify-between cursor-pointer active:translate-y-1  active:[box-shadow:0_0px_0_0_#19999,0_0px_0_0_#19999] active:border-b-[0px] transition-all duration-150 [box-shadow:0_10px_0_0_#19999,0_15px_0_0_#19999]`}
                  onClick={toggleDropdown}
                >
                  <span
                    className={`font-bold group-hover:text-white transition-all duration-150 ${
                      activeTab === currentYearTab
                        ? "text-white"
                        : "text-lightGray"
                    } ${isDropdownOpen && "text-white"}`}
                  >
                    {String(activeTab).length >= 4
                      ? `${activeTab} Season`
                      : "Select a Season"}
                  </span>
                  <FaArrowUp
                    className={`transform text-lightGray group-hover:text-white transition-all duration-150 ${
                      isDropdownOpen ? "-rotate-180 text-white" : ""
                    }`}
                  />
                </div>
                <div
                  className={`absolute right-0 left-0 bg-card text-white rounded-b-lg px-3 py-4 ${
                    isDropdownOpen ? "block" : "hidden"
                  } z-20`}
                >
                  {yearsParticipated?.length > 0 ? (
                    <div className="grid grid-cols-3 gap-3">
                      {yearsParticipated?.map((year: any, key: any) => (
                        <div
                          key={key}
                          className="transition-all duration-150 cursor-pointer text-lightGray hover:text-white bg-card border border-[#2A2A2A] hover:cursor-pointer py-1 px-3 rounded-lg"
                          onClick={(): void => {
                            handleTabClick(Number(year));
                            setIsDropdownOpen(false);
                            setCurrentYearTab(year);
                          }}
                        >
                          {year}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="px-2 text-lightGray">
                      Looks like {teamInfo?.team_number} hasn&apos;t competed,
                      yet.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {loading && activeTab.length === 4 && (
              <p className="text-gray-400 mt-5">
                Loading {activeTab} Season...
              </p>
            )}

            {activeTab === 1 && <AboutTab team={teamInfo} />}

            {activeTab === 2 && (
              <AwardsTab
                team={teamInfo}
                showAll={showAll}
                setShowAll={setShowAll}
              />
            )}

            {activeTab === 3 && (
              <TeamMembersTab members={teamMembers} team={teamInfo} />
            )}

            {activeTab === 4 && <EventsTab events={teamEvents} />}

            <div className="flex flex-col gap-5">
              {year.includes(activeTab) &&
                teamEvents
                  .filter((event: any) => event.year === activeTab)
                  .sort((a: any, b: any) => {
                    const aTimestamp: number = new Date(a.start_date).getTime();
                    const bTimestamp: number = new Date(b.start_date).getTime();
                    return bTimestamp - aTimestamp;
                  })
                  .map((event: any, key: number) => {
                    const allEventMatches = eventMatches.filter(
                      (match: any) => match.event_key === event.key
                    );

                    const playlists: any = {};

                    teamEvents
                      .filter((event: any) => event.year === activeTab)
                      .forEach((event: any): void => {
                        const eventCode = event.event_code;

                        allEventMatches.forEach((match: any): void => {
                          if (!playlists[eventCode]) {
                            playlists[eventCode] = [];
                          }
                          if (match.videos) {
                            match.videos
                              .filter(
                                (video: any): boolean =>
                                  video.type === "youtube"
                              )
                              .forEach((video: any): void => {
                                if (video.key)
                                  playlists[eventCode].push(video.key);
                              });
                          }
                        });
                      });

                    return (
                      <div
                        key={key}
                        className="border border-[#2A2A2A] bg-card mt-5 flex-wrap md:w-full rounded-lg px-8 py-5"
                      >
                        <div className="flex justify-between">
                          <div>
                            <Link href={`/events/${event.key}`} legacyBehavior>
                              <a>
                                <h1
                                  className="font-black text-primary text-2xl hover:text-white"
                                  key={key}
                                >
                                  {event.name}
                                </h1>
                              </a>
                            </Link>
                            <a
                              href={event.gmaps_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <p className="text-lightGray hover:text-white">
                                {event.location_name &&
                                  `${event.location_name}, ${event.city}, ${event.country}`}
                              </p>
                            </a>
                            <span className="text-md text-lightGray">
                              {convertDate(event.start_date)} -{" "}
                              {convertDate(event.end_date)}, {activeTab}
                            </span>
                            <div className="md:hidden block mt-5">
                              {isLive(event.start_date, event.end_date) <=
                                event.end_date &&
                                event.webcasts.length > 0 && (
                                  <a
                                    href={`https://twitch.tv/${event.webcasts[0].channel}`}
                                    rel="noopener noreferrer"
                                    target="_blank"
                                  >
                                    <div className="flex bg-[#6441a5] text-white hover:bg-white hover:text-primary py-1 px-5 rounded-lg font-bold">
                                      <FaTwitch className="text-md mt-1 mr-2" />{" "}
                                      {event.webcasts[0].channel}
                                    </div>
                                  </a>
                                )}
                            </div>
                          </div>
                          <div className="md:block hidden">
                            {isLive(event.start_date, event.end_date) &&
                              event.webcasts.length > 0 && (
                                <a
                                  href={`https://twitch.tv/${event.webcasts[0].channel}`}
                                  rel="noopener noreferrer"
                                  target="_blank"
                                >
                                  <div className="flex bg-[#6441a5] text-white hover:bg-gray-600 hover:text-primary py-1 px-5 rounded-lg font-bold">
                                    <FaTwitch className="text-md mt-1 mr-2" />{" "}
                                    {event.webcasts[0].channel}
                                  </div>
                                </a>
                              )}
                          </div>
                        </div>

                        {allEventMatches.length === 0 ? (
                          <ErrorMessage message="Looks like there's no data available for this event!" />
                        ) : (
                          <EventData
                            data={allEventMatches}
                            team={team}
                            isTeam={true}
                            setLoading={setLoading}
                            event={event}
                            playlists={playlists}
                          />
                        )}
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<any> => {
  const session: Session = (await getServerSession(
    context.req,
    context.res,
    authOptions
  )) as Session;
  const { team }: any = context.params;

  const [teamInfo, teamSocials] = await Promise.all([
    await db.team.findUnique({
      where: {
        team_number: Number(team),
      },
    }),
    await fetch(`${API_URL}/api/v2/teams/socials?team=${team}`).then((res) =>
      res.json()
    ),
  ]);

  if (teamInfo) {
    const teamEvents: any = await db.team
      .findUnique({
        where: {
          team_number: Number(team),
        },
      })
      .events({
        orderBy: {
          year: "desc",
        },
      });

    let eventMatches: any[] = [];

    for (const event of teamEvents) {
      const eventWithMatches = await db.event
        .findUnique({
          where: {
            key: event.key,
          },
        })
        .matches();

      if (eventWithMatches) {
        eventMatches.push(...eventWithMatches);
      }
    }

    const teamMembers: User[] = await db.user.findMany({
      where: {
        teamNumber: Number(team),
      },
    });

    if (session) {
      const user: (User & { favouritedTeams: FavouritedTeam[] }) | null =
        await db.user.findUnique({
          where: {
            // @ts-ignore
            id: session.user.id,
          },
          include: {
            favouritedTeams: true,
          },
        });

      return {
        props: {
          user: JSON.parse(JSON.stringify(user)),
          teamMembers: JSON.parse(JSON.stringify(teamMembers)),
          teamInfo,
          teamEvents,
          eventMatches: JSON.parse(
            JSON.stringify(eventMatches, (key, value) =>
              typeof value === "bigint" ? value.toString() : value
            )
          ),
          teamSocials,
        },
      };
    }

    return {
      props: {
        teamInfo,
        teamEvents,
        eventMatches: JSON.parse(
          JSON.stringify(
            eventMatches,
            (key, value) =>
              typeof value === "bigint" ? value.toString() : value // return everything else unchanged
          )
        ),
        teamMembers: JSON.parse(JSON.stringify(teamMembers)),
        teamSocials,
      },
    };
  }

  return {
    props: {
      teamInfo: [],
    },
  };
};
