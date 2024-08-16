import clsx from "clsx";
import { Asset } from "../modules/assets";
import { ArrowUpRight, Dot, Export, MapPin } from "@phosphor-icons/react";
import { getImageUrl } from "../shared/helpers/getImageUrl";
import { useState } from "react";
import { ASSET_SUBTYPES_MAP, ASSET_TYPES_MAP } from "../modules/taxonomy";
import { PROVIDER_MAP } from "../modules/issuers";
import { NATIVITY_MAP } from "../shared/consts";
import { ChainTag } from "../modules/chains/components/ChainTag";
import { TextShareModal } from "../shared/components/TextShareModal";
import { COUNTRY_CODE_TO_NAME } from "../shared/countryCodes";
import { ExpandableText } from "../shared/components/ExpandableText";

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
  const [showShareOptions, setShowShareOptions] = useState(false);
  const shareUrl = `${window.location.origin}/assets/${asset.id}`;

  const handleShareClick = async () => {
    setShowShareOptions(true);
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
          <div className="font-bold text-gray-600">
            {ASSET_TYPES_MAP[asset.assetTypeId].name}
          </div>
          <div className="flex gap-3 justify-between items-center">
            <div className="flex gap-3">
              {asset?.tokens?.map((token) => (
                <ChainTag key={token.chainId} chainId={token.chainId} />
              ))}
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
            {COUNTRY_CODE_TO_NAME[asset.physicalAddress.country]}
          </div>
          <Dot size={16} />
          <div>
            Issued by{" "}
            <span className="font-bold">
              {PROVIDER_MAP[asset.providerId].name}
            </span>
          </div>
        </div>
        <div className="lg:hidden">
          <ExpandableText
            text={asset.description}
            maxChars={125}
            className="text-sm mb-3"
          />
        </div>
        <div className="hidden lg:block">
          <ExpandableText
            text={asset.description}
            maxChars={150}
            className="text-sm mb-3"
          />
        </div>

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

        <div className={clsx("flex gap-3 mt-3 justify-between")}>
          <a
            href={asset.providerLink}
            target="_blank"
            className="button !bg-grayButton !text-blue-950 max-w-[190px] flex-1 flex justify-center items-center"
          >
            <span className="mr-1">Learn more</span>
            <ArrowUpRight size={16} />
          </a>
          <a
            className="block max-w-[190px] flex-1 button button-gradient text-center justify-self-end"
            href={asset.providerLink}
            target="_blank"
          >
            Buy
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
