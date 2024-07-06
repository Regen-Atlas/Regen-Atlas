import clsx from "clsx";
import { Asset } from "../shared/types";
import { CHAIN_MAPPING } from "../shared/consts/chains";
import { Dot, MapPin, Share } from "@phosphor-icons/react";
import {
  ASSET_SUBTYPES_MAP,
  ASSET_TYPES_MAP,
  NATIVITY_MAP,
} from "../shared/consts";
import { PROVIDER_MAP } from "../shared/consts/provider";
import { getImageUrl } from "../shared/helpers/getImageUrl";
import { useState } from "react";

interface AssetCardProps {
  className?: string;
  asset: Asset;
  onPinClicked: () => void;
}

export default ({
  className,
  asset,
  onPinClicked,
}: AssetCardProps): React.ReactElement => {
  const [learnMoreOpen, setLearnMoreOpen] = useState(false);

  return (
    <div
      className={clsx(
        "asset-card border-2 border-white p-3 rounded-[20px] bg-cardBackground",
        className
      )}
    >
      <div className="flex justify-between">
        <div className="font-bold text-gray-600">
          {ASSET_TYPES_MAP[asset.assetTypeId].name}
        </div>
        <div className="flex gap-3 justify-between items-center">
          <div className="flex gap-3">
            {asset?.tokens?.map((token) => (
              <div
                key={token.chainId}
                className="flex items-center text-xs font-semibold py-1 px-3 rounded-full"
                style={{
                  backgroundColor: CHAIN_MAPPING[token.chainId].color,
                  color: CHAIN_MAPPING[token.chainId].textColor,
                }}
              >
                {CHAIN_MAPPING[token.chainId].name || ""}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        className="h-40 bg-cover bg-center bg-no-repeat mt-3 mb-3 rounded-[20px]"
        style={{
          backgroundImage: `url(${getImageUrl(asset)})`,
        }}
      ></div>
      <h3 className="text-xl xl:text-2xl font-bold">{asset.name}</h3>
      <div className="flex items-center pt-1 pb-2 text-sm">
        <div
          className="flex items-center cursor-pointer"
          onClick={onPinClicked}
        >
          <MapPin size={16} />
          {asset.physicalAddress.region
            ? `${asset.physicalAddress.region}, `
            : ""}
          {asset.physicalAddress.country}
        </div>
        <Dot size={16} />
        <div>
          Issued by{" "}
          <span className="font-bold">
            {PROVIDER_MAP[asset.providerId].name}
          </span>
        </div>
      </div>
      <p
        className={clsx(
          "text-sm overflow-hidden text-ellipsis max-h-[80px] line-clamp-4 mb-3",
          learnMoreOpen && "line-clamp-none max-h-[none]",
          learnMoreOpen && "overflow-visible"
        )}
      >
        {asset.description}
      </p>

      <div>
        <div className="flex justify-between py-1">
          <p className="font-bold">Nativity</p>
          <div className="bg-grayTag h-7 flex justify-center items-center rounded-full px-4 text-sm font-bold">
            {asset.nativity ? NATIVITY_MAP[asset.nativity] : ""}
          </div>
        </div>

        <div className="flex justify-between py-1">
          <p className="font-bold">Subtype</p>
          <div className="bg-grayTag h-7 flex justify-center items-center rounded-full px-4 text-sm font-bold">
            {ASSET_SUBTYPES_MAP[asset.assetSubtypeId].name}
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-3 mt-3">
        <button
          className="button !bg-grayButton !text-blue-950 max-w-[190px] flex-1"
          onClick={() => setLearnMoreOpen(true)}
        >
          Learn more
        </button>
        <a
          className="block max-w-[190px] flex-1 button button-gradient text-center"
          href={asset.providerLink}
          target="_blank"
        >
          Buy
        </a>
      </div>
    </div>
  );
};
