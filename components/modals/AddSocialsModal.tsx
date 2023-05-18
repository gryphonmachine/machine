import { Dispatch, SetStateAction, useState } from "react";
import { Modal } from "./Modal";
import Image from "next/image";
import { Socials } from "@/lib/lists/socials";
import { API_URL } from "@/lib/constants";
import { Input } from "./EditProfileModal";

type SocialInput = {
  handle: string;
  type: string;
};

type Props = {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  team: any;
  avatar: any;
  socials: any;
};

const AddSocialButton = (props: any) => {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleClick = async () => {
    if (!Object.keys(props.socialInputs).length) {
      return setError(true);
    } else {
      setSubmitted(true);

      const requestData = props.socialInputs.map((input: SocialInput) => ({
        handle: input.handle,
        type: input.type,
      }));

      await fetch(
        `${API_URL}/api/team/socials/add?team=${props.team.team_number}`,
        {
          method: "POST",
          body: JSON.stringify(requestData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      props.setOpen(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`mt-3 border ${submitted && "text-green-400 py-2"} ${
        error && "text-red-400 py-2"
      } ${
        !submitted && !error && "text-lightGray"
      } border-[#2A2A2A] bg-card px-3 rounded-lg py-1 text-sm hover:border-gray-600`}
    >
      {error && !submitted && "You can't submit nothing."}

      {!error &&
        (props.text && !submitted
          ? props.text
          : submitted
          ? "Thanks! Your social(s) will be reviewed by a moderator shortly."
          : "Add")}
    </button>
  );
};

const ModalHeader = (props: { team: any; avatar: any }) => {
  const [error, setError] = useState(false);

  return (
    <div className="flex">
      <Image
        src={
          props.avatar
            ? `data:image/jpeg;base64,${props.avatar}`
            : `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${
                props.team.website?.startsWith("https")
                  ? props.team.website
                  : `https://${props.team.website?.slice(7)}`
              }/&size=64`
        }
        onError={() => {
          setError(true);
        }}
        height="25"
        width="40"
        className="mr-2"
        alt={`${props.team.team_number} Avatar`}
      />
      <h1 className="font-semibold text-xl">
        Add Socials
        <p className="text-xs text-lightGray font-medium">
          {props.team.team_number} | {props.team.nickname}
        </p>
      </h1>
    </div>
  );
};

const ModalBody = (props: {
  setOpen: Dispatch<SetStateAction<boolean>>;
  team: any;
  socials: any;
}) => {
  const [socialInputs, setSocialInputs] = useState<SocialInput[]>([]);

  const handleInputChange = (key: string, value: string, type: string) => {
    setSocialInputs((prevInputs) => {
      const updatedInputs = prevInputs.map((input) => {
        if (input.type === type) {
          return { ...input, handle: value };
        }
        return input;
      });

      if (!updatedInputs.some((input) => input.type === type)) {
        return [...updatedInputs, { handle: value, type }];
      }

      return updatedInputs;
    });
  };

  return (
    <div className="flex flex-col mt-6 gap-3">
      {Socials.map((social: any, key: any) => {
        const socialExists = props.socials.some(
          (originalSocial: any) =>
            social.name.toLowerCase() === originalSocial.type
        );

        const existingSocial = props.socials.filter(
          (originalSocial: any) =>
            social.name.toLowerCase() === originalSocial.type
        );

        const handle =
          existingSocial.length > 0 ? existingSocial[0].handle : "";

        return (
          <div key={key} className="flex gap-x-2">
            <Input
              primaryPlaceholder={social.name}
              icon={social.icon}
              placeholder={handle}
              disabled={socialExists ? true : false}
              state={(value) =>
                handleInputChange(social.name, value, social.name.toLowerCase())
              }
              className={social.className}
            />
          </div>
        );
      })}

      <AddSocialButton
        text={`Add ${socialInputs.length < 1 ? "Socials" : ""}${socialInputs
          .filter((social) => social.handle.length > 0)
          .map((social, index, array) => {
            const socialType =
              social.type.charAt(0).toUpperCase() + social.type.slice(1);
            if (index === array.length - 1) {
              if (array.length === 1) {
                return socialType;
              } else if (array.length > 1) {
                return `and ${socialType}`;
              } else {
                return `, ${socialType}`;
              }
            }
            return socialType;
          })
          .join(", ")}`}
        team={props.team}
        teamNumber={props.team.team_number}
        socialInputs={socialInputs}
        setOpen={props.setOpen}
      />
    </div>
  );
};

export const AddSocialsModal = ({
  isOpen,
  setOpen,
  team,
  avatar,
  socials,
}: Props) => {
  return (
    <Modal
      header={<ModalHeader team={team} avatar={avatar} />}
      body={<ModalBody setOpen={setOpen} team={team} socials={socials} />}
      isOpen={isOpen}
      setOpen={setOpen}
    />
  );
};
