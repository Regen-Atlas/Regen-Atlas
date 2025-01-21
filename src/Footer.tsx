import { XLogo } from "@phosphor-icons/react";
import clsx from "clsx";
import { MapStyleSwitch } from "./shared/components/MapStyleSwitch";
import { ParagraphIcon } from "./shared/components/ParagraphIcon";
import { analytics } from "./modules/analytics";
import { Link } from "react-router-dom";

export default ({
  showMapStyleSwitch = false,
  twoRows = false,
}: {
  showMapStyleSwitch?: boolean;
  twoRows?: boolean;
}): React.ReactElement => {
  return (
    <footer
      className={clsx(
        "flex justify-between items-center h-[50px]",
        twoRows && "lg:flex-col xl:flex-row lg:text-sm xl:text-base"
      )}
    >
      {twoRows && (
        <div className="hidden lg:flex xl:hidden items-center gap-4">
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
            <XLogo size={16} />
          </a>
          <a
            className="w-4 h-4"
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
            <ParagraphIcon className="w-[14px] h-[14px]" />
          </a>
        </div>
      )}
      <div className="flex items-center justify-between w-full">
        <p>© Regen Atlas 2025</p>
        {showMapStyleSwitch && <MapStyleSwitch />}
        <div className="flex items-center gap-4">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/imprint">Impressum</Link>
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
            className={clsx(twoRows && "block md:hidden xl:block")}
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
            className={clsx(twoRows && "block md:hidden xl:block", "w-6 h-6")}
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
            className={clsx(twoRows && "block md:hidden xl:block")}
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
      </div>
    </footer>
  );
};
