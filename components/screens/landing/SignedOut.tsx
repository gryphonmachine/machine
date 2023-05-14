/* eslint-disable @next/next/no-img-element */
import { Card } from "@/components/misc/Card";
import { FAQ } from "@/components/misc/FAQ";
import { Feature } from "@/components/misc/Feature";
import { BMAC_URL, CURR_YEAR, DISCORD_URL, GITHUB_URL } from "@/lib/constants";
import { getStorage, setStorage } from "@/utils/localStorage";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaGithub, FaDiscord, FaCoffee } from "react-icons/fa";

async function getContributors() {
  const contributors = getStorage("contributors");

  if (contributors) return contributors;

  const fetchContributors = await fetch(
    GITHUB_URL+"/contributors?per_page=100"
  )
    .then((response) => response.json())
    .then((contributors) =>
      contributors
        .filter((contributor: any) => !contributor.login.endsWith("[bot]"))
        .slice(0, 10)
    );

  setStorage("contributors", fetchContributors);
  return fetchContributors;
}

export const SignedOutScreen = () => {
  const [contributors, setContributors] = useState([]);

  useEffect(() => {
    const fetchContributors = async () => {
      const allContributors = await getContributors();
      setContributors(allContributors);
    };

    fetchContributors();
  });

  return (
    <div className="pl-4 pr-4 md:pr-8 md:pl-8 mt-5">
      <div className="flex flex-col md:grid grid-cols-3 gap-x-5">
        <Card className="relative h-48 sm:h-auto" withHeight>
          <Image
            src="/smLogoGray.png"
            height="60"
            width="60"
            alt="Scout Machine Logo"
            priority={true}
            className="ml-[-8px]"
          />

          <p className="text-white pr-6 md:pr-0 font-semibold text-2xl md:text-4xl">
            Smarter FRC data insights
          </p>

          <div className="flex flex-wrap -space-x-1 overflow-hidden absolute bottom-10">
            {contributors.map((contributor: any, key: number) => {
              return (
                <a
                  key={contributor.id}
                  href={contributor.html_url}
                  target="_blank"
                >
                  <img
                    src={contributor.avatar_url}
                    alt={contributor.login}
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-card hover:opacity-90"
                  />
                </a>
              );
            })}
          </div>
        </Card>

        <Card>
          <h1 className="text-lightGray text-xl">
            Scout Machine is the all-in-one tool your FRC team needs to find the
            data you want, when you want. From accessing important data points
            to viewing match histories and tracking performance metrics -
            it&apos;s all in one place. <br /> <br />{" "}
            <span className="text-white">
              Say goodbye to time-consuming data analysis and hello to
            </span>{" "}
            <span className="text-primary">Scout Machine</span>.
          </h1>
        </Card>
        <Card>
          <h1 className="text-xl text-lightGray">
            We&apos;re 100% open-source on{" "}
            <a
              href={`${GITHUB_URL}`}
              target="_blank"
              className="text-white"
            >
              <span className="inline-block align-top	ml-1">
                <FaGithub className="text-3xl" />
              </span>{" "}
              Github.
            </a>
            <br /> <br />
            If you have any questions, feature requests, bug reports, or you
            just want to see some sneak peeks of updates, join our{" "}
            <a href={DISCORD_URL} target="_blank" className="text-violet-400">
              <span className="inline-block align-top">
                <FaDiscord className="text-3xl" />
              </span>{" "}
              Discord
            </a>
            .
            <br />
            <br />
            Loving the site & want to support us? <br />{" "}
            <a
              href={BMAC_URL}
              target="_blank"
              className="text-primary hover:text-white"
            >
              <span className="inline-block align-top">
                <FaCoffee className="text-3xl" />
              </span>{" "}
              Buy us a Coffee
            </a>
          </h1>
        </Card>
      </div>
      <div className="flex flex-col md:grid grid-cols-2 gap-x-5">
        <Card>
          <h1 className="text-2xl text-white font-bold mb-5">
            All the features you could ever want...
          </h1>
          <div className="gap-3 flex flex-wrap">
            <Feature name="simple & modern design" />
            <Feature name="user accounts" />
            <Feature name="favourite teams" />
            <Feature name="discover teams" href="/teams" />
            <Feature name={`all ${CURR_YEAR} events`} href="/events" />
            <Feature name="event pages" href="/events/2023cmptx" />
            <Feature name="team pages" href="/teams/6070"/>
            <Feature name="match pages" />
            <Feature name="team awards" href="/teams/6070"/>
            <Feature name="hall of fame teams" href="/fame" />
            <Feature name={`${CURR_YEAR} rookie teams`} href="/rookies" />
            <Feature name="game day" href="/gameday" />
            <Feature name="marketplace (buy & sell)" href="/marketplace" />
            <Feature name="custom search (+ nearby)" href="/events" />
            <Feature name="100% free, no paywall" href={BMAC_URL}/>
            <Feature name="open source" href={GITHUB_URL}/>
          </div>
        </Card>
        <Card>
          <h1 className="text-2xl text-white font-bold mb-5">
            Frequently Asked Questions
          </h1>
          <FAQ
            question="What is Scout Machine?"
            answer="Scout Machine is the all-in-one tool your FRC team needs. Providing key scouting and match data, along with a unique market for FRC goods."
          />
          <FAQ
            question="I found a bug. How do I report it?"
            answer={`Go to ${GITHUB_URL}/issues and click get started on the bug report template.`}
          />
          <FAQ
            question="I want a feature to be added. How do I suggest it?"
            answer={`Go to ${GITHUB_URL}/issues and click get started on the feature request template.`}
          />
          <FAQ
            question="How can I help?"
            answer={
              <div>
                <p className="font-medium mb-[-2px]">
                  Financially via{" "}
                  <a
                    className="text-primary hover:text-white"
                    href={BMAC_URL}
                    target="_blank"
                  >
                    Buy Me a Coffee
                  </a>
                </p>
                <span className="text-sm">
                  All donations will go directly towards helping improve the
                  site (hosting, databases, etc).
                </span>

                <p className="font-medium mt-4 mb-[-2px]">
                  Contributing Code via{" "}
                  <a className="text-white" href={GITHUB_URL} target="_blank">
                    Github
                  </a>
                </p>
                <span className="text-sm">
                  We welcome all new contributors! There&apos;s a lot to get
                  done & we need your help.
                </span>
              </div>
            }
          />
        </Card>
      </div>
    </div>
  );
};
