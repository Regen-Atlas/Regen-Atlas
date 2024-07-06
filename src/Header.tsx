import { useState } from "react";
import { List } from "@phosphor-icons/react";
import { Modal } from "./shared/components/Modal";
import { ConnectKitButton } from "connectkit";
import { router } from "./main";
import clsx from "clsx";
import { Link } from "react-router-dom";
import FiltersDesktop from "./Explore/FiltersDesktop";

const menuItems = [
  {
    name: "Explore",
    link: "/",
  },
  {
    name: "Analytics",
    link: "#",
  },
  {
    name: "Add Asset",
    link: "#",
    url: "https://docs.google.com/forms/d/e/1FAIpQLSeuQ0rvSOMiV5r3lfQuj2D436PMnJuDpqYZ-k1CVOT1OlYQbA/viewform",
  },
  {
    name: "T&C",
    link: "#",
  },
];

export default (): React.ReactElement => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <header
      className={clsx(
        "px-3 md:px-4 z-20 fixed top-0 left-0 h-[60px] md:h-[80px] w-full",
        "bg-background site-header"
      )}
    >
      <div className="flex justify-between items-center h-[60px] md:h-[80px]">
        <a
          className="hidden md:block"
          href="https://x.com/theregenatlas"
          target="_blank"
        >
          <img src="/RA_logo-01.svg" alt="logo" className="h-[44px]" />
        </a>
        <a
          className="block md:hidden h-[40px]"
          href="https://x.com/theregenatlas"
          target="_blank"
        >
          <img src="/RA_logo-02.svg" alt="logo" className="h-[40px]" />
        </a>
        {/* <div className="hidden md:flex">
          {menuItems.map((item) => {
            if (item.url) {
              return (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  key={item.name}
                  className="p-4 text-2xl"
                >
                  {item.name}
                </a>
              );
            } else {
              return (
                <Link to={item.link} key={item.name} className="p-4 text-2xl">
                  {item.name}
                </Link>
              );
            }
          })}
        </div> */}
        <div className="hidden lg:flex justify-center">
          <FiltersDesktop />
        </div>
        <div className="hidden lg:flex">
          <ConnectKitButton />
        </div>
        <List
          className="lg:hidden"
          onClick={() => setIsModalOpen(true)}
          size={40}
        />
        {isModalOpen && (
          <Modal fullScreen={true} onClose={() => setIsModalOpen(false)}>
            <div className="flex flex-col justify-between h-full">
              <div className="flex flex-col items-center mt-[120px]">
                {menuItems.map((item) => (
                  <div
                    key={item.name}
                    className="p-4 text-2xl mb-2"
                    onClick={() => {
                      router
                        .navigate(item.link)
                        .then(() => setIsModalOpen(false));
                    }}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
              <div className="flex justify-center pb-12">
                <ConnectKitButton />
              </div>
            </div>
          </Modal>
        )}
      </div>
    </header>
  );
};
