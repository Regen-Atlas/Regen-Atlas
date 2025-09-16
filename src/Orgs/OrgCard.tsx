import clsx from "clsx";
import { ArrowUpRight, Dot, Export, MapPin } from "@phosphor-icons/react";
import { useRef, useState } from "react";
import { ChainTag } from "../modules/chains/components/ChainTag";
import { TextShareModal } from "../shared/components/TextShareModal";
import { ExpandableText } from "../shared/components/ExpandableText";
import { Org } from "../shared/types";
import { Link } from "react-router-dom";
import SocialLinks from "./SocialLinks";

interface OrgCardProps {
  className?: string;
  org: Org;
  onPinClicked: () => void;
}

export default ({
  className,
  org,
  onPinClicked,
}: OrgCardProps): React.ReactElement => {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownPage, setDropdownPage] = useState(0);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const ITEMS_PER_PAGE = 3;

  const shareUrl = `${window.location.origin}/orgs/${org.id}`;

  const handleShareClick = async () => {
    setShowShareOptions(true);
  };

  const renderDropdown = (assets: Array<{ id: string; name: string }>) => {
    const page = dropdownPage;
    const start = 1 + page * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const paginatedItems = assets.slice(start, end);
    const hasMore = end < assets.length;

    return (
      <div
        ref={dropdownRef}
        className="absolute z-50 top-9 left-0 w-64 bg-white border border-gray-300 rounded-xl shadow-xl overflow-y-auto max-h-60"
      >
        <div className="flex flex-col divide-y divide-gray-100">
          {paginatedItems.map((item) => (
            <Link key={item.id} to={`/assets/${item.id}`}>
              <div className="px-4 py-2 truncate hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors duration-150 text-sm font-medium max-w-full">
                {item.name}
              </div>
            </Link>
          ))}
          {hasMore && (
            <div
              className="px-4 py-2 text-blue-500 text-sm font-medium cursor-pointer hover:underline"
              onClick={() => setDropdownPage((prev) => prev + 1)}
            >
              + more available
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className={clsx(
          "asset-card border-2 border-white p-3 rounded-[20px] bg-cardBackground",
          className
        )}
      >
        <div className="flex justify-between">
          <h3 className="font-bold text-xl">{org.name}</h3>
          <div className="flex gap-3 justify-between items-center">
            <div className="flex gap-3">
              {org.ecosystems.map((ecosystem) => (
                <div
                  className="w-7 h-7 flex items-center justify-center rounded-full"
                  key={ecosystem.id}
                >
                  <img
                    src={ecosystem.icon}
                    alt={ecosystem.name}
                    className="w-7 h-7 rounded-full"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Export
                className="cursor-pointer"
                size={25}
                onClick={handleShareClick}
              />
            </div>
          </div>
        </div>
        <div
          className="h-40 bg-cover bg-center bg-no-repeat mt-3 mb-3 rounded-[20px]"
          style={{ backgroundImage: `url(${org.main_image})` }}
        ></div>
        <div className="flex items-center pt-1 pb-2 text-sm">
          <div
            className="flex items-center cursor-pointer"
            onClick={onPinClicked}
          >
            <MapPin size={16} />
            {org.address}
          </div>
          <Dot size={16} />
        </div>

        <div className="lg:hidden">
          <ExpandableText
            text={org.description}
            maxChars={125}
            className="text-sm mb-3"
          />
        </div>
        <div className="hidden lg:block">
          <ExpandableText
            text={org.description}
            maxChars={150}
            className="text-sm mb-3"
          />
        </div>

        <div className="xxs:text-[13px] text-sm">
          {org.assets.length > 0 && (
            <div className="flex justify-between items-start py-1 min-h-9">
              <p className="font-bold mr-4">Associated Assets</p>
              <div className="xxs:text-xs text-sm font-bold text-right flex items-center flex-wrap gap-2">
                <Link to={`/assets/${org.assets[0].id}`}>
                  <div className="bg-grayTag h-7 flex justify-center items-center rounded-full px-4 xxs:text-xs text-sm font-bold cursor-pointer">
                    {org.assets[0].name.length > 20
                      ? `${org.assets[0].name.substring(0, 17)}...`
                      : org.assets[0].name}
                  </div>
                </Link>
                <div
                  className="relative"
                  onMouseEnter={() => {
                    if (timeoutRef.current) clearTimeout(timeoutRef.current);
                    setDropdownVisible(true);
                  }}
                  onMouseLeave={() => {
                    timeoutRef.current = setTimeout(() => {
                      setDropdownVisible(false);
                      setDropdownPage(0);
                    }, 500);
                  }}
                >
                  <div className="bg-grayTag h-7 flex justify-center items-center rounded-full px-4 xxs:text-xs text-sm font-bold cursor-pointer">
                    +{org.assets.length - 1}
                  </div>
                  {dropdownVisible && renderDropdown(org.assets)}
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-between items-start py-1 min-h-9">
            <p className="font-bold mr-4">Associated Issuers</p>
            <div className="xxs:text-xs text-sm font-bold text-right flex items-center flex-wrap gap-2">
              {org?.issuers?.map((issuer) => (
                <div
                  className="bg-grayTag h-7 flex justify-center items-center rounded-full px-4 xxs:text-xs text-sm font-bold cursor-pointer"
                  key={issuer.id}
                >
                  {issuer.name}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center py-1 min-h-9">
            <p className="font-bold mr-4">Treasury</p>
            <div className="xxs:text-xs text-sm font-bold text-right flex items-center">
              {org?.treasury?.map((treasury) => (
                <a
                  key={treasury.platform.id}
                  href={treasury.link}
                  target="_blank"
                >
                  <ChainTag
                    key={treasury.platform.id}
                    platform={treasury.platform}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        <SocialLinks org={org} />

        <div
          className={clsx("flex gap-3 mt-3 justify-between xxs:text-[13px]")}
        >
          <a
            href={org.impact_link || ""}
            target="_blank"
            className="button !bg-grayButton !text-blue-950 max-w-[190px] flex-1 flex justify-center items-center"
          >
            <span className="mr-1">Impact</span>
            <ArrowUpRight size={16} />
          </a>

          <a
            href={org.link || ""}
            target="_blank"
            className="button !bg-grayButton !text-blue-950 max-w-[190px] flex-1 flex justify-center items-center"
          >
            <span className="mr-1">Website</span>
            <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
      {showShareOptions && (
        <TextShareModal
          text={shareUrl}
          onClose={() => setShowShareOptions(false)}
        />
      )}
    </>
  );
};
