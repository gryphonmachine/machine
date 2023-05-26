import { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { Modal } from "./Modal";

type Props = {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const ModalHeader = () => (
  <>
    <div className="mb-2 flex justify-center">
      <Image
        src="/smLogo.png"
        height={50}
        width={50}
        alt="Scout Machine Logo"
        priority={true}
      />
    </div>
    <h1 className="font-semibold text-xl text-center text-black dark:text-white">
      Sign up / Scout Machine
    </h1>
  </>
);

const ModalBody = () => (
  <div className="mt-2 space-y-4 text-center">
    <p className="text-sm text-gray-500">
      Thank you for considering using Scout Machine! We appreciate each and
      every one of our users.
    </p>
  </div>
);

const ModalFooter = () => (
  <>
    <div className="flex flex-row justify-center items-center gap-2">
      <div className="mt-4">
        <button
          type="button"
          className="flex rounded-lg bg-red-500 hover:bg-red-600 text-black dark:text-white px-4 py-2 text-sm font-medium whitespace-nowrap"
          onClick={async () => await signIn("google")}
        >
          <FaGoogle className="text-xl mr-2" /> Continue with Google
        </button>
      </div>
      <div className="mt-4">
        <button
          type="button"
          className="flex rounded-lg bg-gray-100 hover:bg-gray-300 text-black px-4 py-2 text-sm font-medium whitespace-nowrap"
          onClick={async () => await signIn("github")}
        >
          <FaGithub className="text-xl mr-2" /> Continue with Github
        </button>
      </div>
    </div>
    <p className="text-xs text-lightGray mt-2 text-center">
      All data collected will be kept private at all times.
    </p>
  </>
);

export const SignupModal = ({ isOpen, setOpen }: Props) => {
  return (
    <Modal
      header={<ModalHeader />}
      body={<ModalBody />}
      footer={<ModalFooter />}
      isOpen={isOpen}
      setOpen={setOpen}
    />
  );
};
