import clsx from "clsx";
import { ArrowUpRight, Dot, Export, MapPin } from "@phosphor-icons/react";
import { useState } from "react";
import { NEW_NATIVITY_MAP } from "../shared/consts";
import { ChainTag } from "../modules/chains/components/ChainTag";
import { TextShareModal } from "../shared/components/TextShareModal";
import { ExpandableText } from "../shared/components/ExpandableText";
import { Link } from "react-router-dom";
import { NewAsset } from "../shared/types";
import { useBaseState } from "../context/base";

interface AssetCardProps {
  className?: string;
  asset: NewAsset;
  showBuyButton?: boolean;
  onPinClicked: () => void;
}

export default ({
  className,
  asset,
  showBuyButton = true,
  onPinClicked,
}: AssetCardProps): React.ReactElement => {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const shareUrl = `${window.location.origin}/assets/${asset.id}`;

  const handleShareClick = async () => {
    setShowShareOptions(true);
  };

  const SUPPORTED_TOKENS = ["0x50E85c754929840B58614F48e29C64BC78C58345"];

  const celoContractAddress: string =
    asset?.tokens?.find((t) => SUPPORTED_TOKENS.includes(t.address))?.address ||
    "";

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
            {asset.asset_types[0].name}
          </div>
          <div className="flex gap-3 justify-between items-center">
            <div className="flex gap-3">
              {asset?.chains?.map((chain) => (
                <ChainTag key={chain.id} chainId={chain.id} />
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
            backgroundImage: `url(${asset.main_image})`,
          }}
        ></div>
        <h3 className="text-xl xl:text-2xl font-bold">{asset.name}</h3>
        <div className="flex items-center pt-1 pb-2 text-sm">
          <div
            className="flex items-center cursor-pointer"
            onClick={onPinClicked}
          >
            <MapPin size={16} />
            {/* {asset.physicalAddress.region
              ? `${asset.physicalAddress.region}, `
              : ""}
            {COUNTRY_CODE_TO_NAME[asset.physicalAddress.country]} */}
          </div>
          <Dot size={16} />
          <div>
            Issued by <span className="font-bold">{asset.issuer.name}</span>
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

        <div className="xxs:text-[13px]">
          <div className="flex justify-between py-1">
            <p className="font-bold">Nativity</p>
            <div className="bg-grayTag h-7 flex justify-center items-center rounded-full px-4 xxs:text-xs text-sm font-bold">
              {asset.nativity ? NEW_NATIVITY_MAP[asset.nativity] : ""}
            </div>
          </div>

          <div className="flex justify-between py-1">
            <p className="font-bold">Subtype</p>
            <div className="bg-grayTag h-7 flex justify-center items-center rounded-full px-4 xxs:text-xs text-sm font-bold">
              {asset.asset_subtypes[0].name}
            </div>
          </div>
        </div>

        <div
          className={clsx("flex gap-3 mt-3 justify-between xxs:text-[13px]")}
        >
          <a
            href={asset.issuer_link || asset.exchange_link}
            target="_blank"
            className="button !bg-grayButton !text-blue-950 max-w-[190px] flex-1 flex justify-center items-center"
          >
            <span className="mr-1">Learn more</span>
            <ArrowUpRight size={16} />
          </a>
          {!!celoContractAddress && showBuyButton && (
            <Link
              className="flex items-center justify-center max-w-[190px] flex-1 button button-gradient text-center justify-self-end"
              to={`/assets/${asset.id}`}
            >
              Buy
            </Link>
          )}
          {!celoContractAddress && showBuyButton && (
            <a
              className="flex items-center justify-center max-w-[190px] flex-1 button button-gradient text-center justify-self-end"
              href={asset.exchange_link || asset.issuer_link}
              target="_blank"
            >
              Buy
            </a>
          )}
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
