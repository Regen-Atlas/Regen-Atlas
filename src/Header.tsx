import { useState } from "react";
import { List } from "@phosphor-icons/react";
import { Modal } from "./shared/components/Modal";
import { ConnectKitButton } from "connectkit";
import { router } from "./main";
import { Logo1 } from "./shared/components/Logo1";

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
    link: "/add-asset",
  },
  {
    name: "T&C",
    link: "#",
  },
];

export default (): React.ReactElement => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <header className="px-3 md:px-4 z-20 fixed top-0 left-0 h-[60px] md:h-[100px] w-full flex justify-between items-center">
      <div className="hidden md:block">
        <img src="/RA_logo-01.svg" alt="logo" className="h-[50px]" />
      </div>
      <div className="md:hidden h-[40px]">
        <img src="/RA_logo-02.svg" alt="logo" className="h-[40px]" />
      </div>
      <List onClick={() => setIsModalOpen(true)} size={40} />
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
    </header>
  );
};
