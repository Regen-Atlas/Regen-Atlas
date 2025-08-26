import { useState } from "react";
import { List, XLogo } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { Modal } from "./shared/components/Modal";
import { ConnectKitButton } from "connectkit";
import { router } from "./main";
import clsx from "clsx";
import FiltersDesktop from "./Explore/FiltersDesktop";
import { ParagraphIcon } from "./shared/components/ParagraphIcon";
import { analytics } from "./modules/analytics";

const menuItems = [
  {
    name: "Explore",
    link: "/",
  },
  {
    name: "List Project",
    link: "#",
    url: "https://docs.google.com/forms/d/e/1FAIpQLSeznO5mTekWfSuj0Y1F70HQTKGOMf1HT6UVr45OAu_8ST7CuA/viewform",
  },
  {
    name: "Docs",
    link: "#",
    url: "https://regen-atlas.gitbook.io/regen-atlas-docs",
  },
  {
    name: "Blog",
    link: "#",
    url: "https://paragraph.xyz/@regenatlas",
  },
  {
    name: "Privacy Policy",
    link: "/privacy-policy",
  },
  {
    name: "Imprint",
    link: "/imprint",
  },
];

export default ({
  showFilters = false,
}: {
  showFilters?: boolean;
}): React.ReactElement => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <header
      className={clsx(
        "px-3 md:px-4 z-20 fixed top-0 left-0 h-[60px] md:h-[70px] w-full",
        "bg-background site-header"
      )}
    >
      <div className="flex justify-between items-center h-[60px] md:h-[80px]">
        <Link className="hidden md:block" to="/">
          <img src="/RA_logo-01.svg" alt="logo" className="h-[44px]" />
        </Link>
        <Link className="block md:hidden h-[40px]" to="/">
          <img src="/RA_logo-02.svg" alt="logo" className="h-[40px]" />
        </Link>
        {showFilters && (
          <div className="hidden lg:flex justify-center xl:absolute xl:top-5 xl:left-[calc(50vw-270px)]">
            <FiltersDesktop />
          </div>
        )}
        <div className="hidden lg:flex items-center gap-4">
          <a
            className="ml-6 hidden button button-gradient text-center button-gradient !text-base xl:block"
            href="https://docs.google.com/forms/d/e/1FAIpQLSeznO5mTekWfSuj0Y1F70HQTKGOMf1HT6UVr45OAu_8ST7CuA/viewform"
            target="_blank"
            onClick={() => {
              analytics.sendEvent({
                category: "Link Click",
                action: "List Project",
                label: "Header Button",
              });
            }}
          >
            List Project
          </a>
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
              <div className="flex flex-col items-center mt-[40px]">
                {menuItems.map((item) => {
                  if (item.url) {
                    return (
                      <a
                        className="p-4 text-2xl mb-2"
                        key={item.name}
                        href={item.url}
                        target="_blank"
                        onClick={() => {
                          analytics.sendEvent({
                            category: "Link Click",
                            action: item.name,
                            label: "Mobile Menu",
                          });
                        }}
                      >
                        {item.name}
                      </a>
                    );
                  } else {
                    return (
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
                    );
                  }
                })}
              </div>
              <div className="flex flex-col justify-center items-center pb-12">
                <ConnectKitButton />
                <div className="flex pt-6 gap-6 justify-center">
                  <a href="https://x.com/theregenatlas" target="_blank">
                    <XLogo size={32} />
                  </a>
                  <a
                    className="w-8 h-8"
                    href="https://warpcast.com/theregenatlas"
                    target="_blank"
                  >
                    <img src="/farcaster.svg" alt="farcaster" />
                  </a>
                  <a href="https://paragraph.xyz/@regenatlas" target="_blank">
                    <ParagraphIcon className="w-7 h-7" />
                  </a>
                </div>
                <p className="mt-4">© Regen Atlas 2025</p>
                <div className="flex flex-col items-center">
                  <img src="/BMWE_de_v3__Web_farbig.svg" width="200" />
                  <p className="text-xs text-center">
                    Funded by the Federal Ministry for Economic Affairs and
                    Energy (BMWi) based on a decision of the German Bundestag.
                  </p>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </header>
  );
};
