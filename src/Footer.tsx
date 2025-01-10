import { XLogo } from "@phosphor-icons/react";
import clsx from "clsx";
import { MapStyleSwitch } from "./shared/components/MapStyleSwitch";
import { ParagraphIcon } from "./shared/components/ParagraphIcon";
import { analytics } from "./modules/analytics";

export default ({
  showMapStyleSwitch = false,
}: {
  showMapStyleSwitch?: boolean;
}): React.ReactElement => {
  return (
    <footer className={clsx("flex justify-between items-center h-[50px]")}>
      <p>© Regen Atlas 2024</p>
      {showMapStyleSwitch && <MapStyleSwitch />}
      <div className="flex items-center gap-4">
        <a
          className="hover:text-primary-400"
          href="https://regen-atlas.gitbook.io/regen-atlas-docs"
          target="_blank"
          onClick={() => {
            analytics.sendEvent({
              category: "Link Click",
              action: "Docs",
              label: "Footer Button",
            });
          }}
        >
          Docs
        </a>
        <a
          className="ml-6 block button button-gradient text-center button-gradient !text-base xl:hidden"
          href="https://docs.google.com/forms/d/e/1FAIpQLSfYpVlE7WYf73nArn2r__SQyGeI11-4OW53EYk8aOd3qzfC8A/viewform"
          target="_blank"
          onClick={() => {
            analytics.sendEvent({
              category: "Link Click",
              action: "List Project",
              label: "Footer Button",
            });
          }}
        >
          List Project
        </a>
        <a
          href="https://x.com/theregenatlas"
          target="_blank"
          onClick={() => {
            analytics.sendEvent({
              category: "Link Click",
              action: "Twitter",
              label: "Footer Button",
            });
          }}
        >
          <XLogo size={24} />
        </a>
        <a
          className="w-6 h-6"
          href="https://warpcast.com/theregenatlas"
          target="_blank"
          onClick={() => {
            analytics.sendEvent({
              category: "Link Click",
              action: "Farcaster",
              label: "Footer Button",
            });
          }}
        >
          <img src="/farcaster.svg" alt="farcaster" />
        </a>
        <a
          href="https://paragraph.xyz/@regenatlas"
          target="_blank"
          onClick={() => {
            analytics.sendEvent({
              category: "Link Click",
              action: "Paragraph",
              label: "Footer Button",
            });
          }}
        >
          <ParagraphIcon className="w-5 h-5" />
        </a>
      </div>
    </footer>
  );
};
