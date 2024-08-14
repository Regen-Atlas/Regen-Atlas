import { XLogo } from "@phosphor-icons/react";
import clsx from "clsx";
import { useFiltersState } from "./context/filters";
import { MapStyleSwitch } from "./shared/components/MapStyleSwitch";

export default (): React.ReactElement => {
  const { selectedAssetId } = useFiltersState();
  const showMapStyleSwitch = !selectedAssetId;
  return (
    <footer className={clsx("flex justify-between items-center h-[50px]")}>
      <p>© Regen Atlas 2024</p>
      {showMapStyleSwitch && <MapStyleSwitch />}
      <div className="flex items-center">
        <a href="https://x.com/theregenatlas" target="_blank">
          <XLogo size={24} />
        </a>
        <a
          className="ml-6 block button button-gradient text-center button-gradient !text-base"
          href="https://docs.google.com/forms/d/e/1FAIpQLSeuQ0rvSOMiV5r3lfQuj2D436PMnJuDpqYZ-k1CVOT1OlYQbA/viewform"
          target="_blank"
        >
          Register Asset
        </a>
      </div>
    </footer>
  );
};
