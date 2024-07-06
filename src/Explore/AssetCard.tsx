import clsx from "clsx";
import { Asset } from "../shared/types";
import { CHAIN_MAPPING } from "../shared/consts/chains";
import { Share } from "@phosphor-icons/react";
import { ASSET_SUBTYPES_MAP, ASSET_TYPES_MAP } from "../shared/consts";
import { PROVIDER_MAP } from "../shared/consts/provider";
import { getImageUrl } from "../shared/helpers/getImageUrl";

interface AssetCardProps {
  className?: string;
  asset: Asset;
}

export default ({ className, asset }: AssetCardProps): React.ReactElement => {
  const tableContent = [
    {
      label: "Nativity",
      value: "Native",
    },
    {
      label: "Subtype",
      value: ASSET_TYPES_MAP[asset.assetTypeId].subtypes.find(
        (subtype) => subtype.id === asset.assetSubtypeId
      )?.name,
    },
    {
      label: "Issuer",
      value: PROVIDER_MAP[asset.providerId].name,
    },
  ];
  return (
    <div
      className={clsx(
        "border-2 border-black p-3 rounded-[20px] bg-cardBackground",
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
          <Share size={24} />
        </div>
      </div>
      <div
        className="h-40 bg-cover bg-center bg-no-repeat mt-3 mb-3 rounded-[20px]"
        style={{
          backgroundImage: `url(${getImageUrl(asset)})`,
        }}
      ></div>
      <h3 className="text-2xl font-bold">{asset.name}</h3>
      <p className="text-sm overflow-hidden text-ellipsis max-h-[80px] line-clamp-4 mb-3">
        {asset.description}
      </p>

      <div>
        <div className="flex justify-between py-1">
          <p className="font-bold">Nativity</p>
          <div className="bg-grayTag h-7 flex justify-center items-center rounded-full px-4 text-sm font-bold">
            Native
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
        <button className="button !bg-grayButton !text-blue-950 max-w-[190px] flex-1">
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
