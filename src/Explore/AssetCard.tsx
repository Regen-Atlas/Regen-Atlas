import clsx from "clsx";
import { Asset } from "../shared/types";
import { CHAIN_MAPPING } from "../shared/consts/chains";
import { Share } from "@phosphor-icons/react";
import { ASSET_TYPES_MAP } from "../shared/consts";
import { PROVIDER_MAP } from "../shared/consts/provider";
import { getImageUrl } from "../shared/helpers/getImageUrl";

interface AssetCardProps {
  className?: string;
  asset: Asset;
}

export default ({ className, asset }: AssetCardProps): React.ReactElement => {
  const tableContent = [
    {
      label: "Type",
      value: ASSET_TYPES_MAP[asset.assetTypeId].name,
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
      className={clsx("border-2 border-black p-3 rounded-[20px]", className)}
    >
      <div className="flex justify-between">
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
        {tableContent.map((content) => (
          <div
            key={content.label}
            className="flex justify-between border-b-[1px] border-neutral-300 py-2 last:border-b-0"
          >
            <p className="text-sm font-semibold">{content.label}</p>
            <p className="text-sm">{content.value}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <button className="button max-w-[190px] flex-1">Learn more</button>
        <button className="button max-w-[190px] flex-1">Buy</button>
      </div>
    </div>
  );
};
