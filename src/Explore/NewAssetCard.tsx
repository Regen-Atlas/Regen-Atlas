import clsx from "clsx";
import { ArrowUpRight, Dot, Export, MapPin } from "@phosphor-icons/react";
import { useState } from "react";
import { NEW_NATIVITY_MAP } from "../shared/consts";
import { ChainTag } from "../modules/chains/components/ChainTag";
import { TextShareModal } from "../shared/components/TextShareModal";
import { ExpandableText } from "../shared/components/ExpandableText";
import { Link } from "react-router-dom";
import { NewAsset } from "../shared/types";
import { SUPPORTED_TOKENS } from "../modules/uniswap";
import { COUNTRY_CODE_TO_NAME } from "../shared/countryCodes";

interface AssetCardProps {
  className?: string;
  asset: NewAsset;
  showExternalLink?: boolean;
  onPinClicked: () => void;
}

export default ({
  className,
  asset,
  showExternalLink = false,
  onPinClicked,
}: AssetCardProps): React.ReactElement => {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const shareUrl = `${window.location.origin}/assets/${asset.id}`;

  const handleShareClick = async () => {
    setShowShareOptions(true);
  };

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
            {asset.region ? `${asset.region}, ` : ""}
            {COUNTRY_CODE_TO_NAME[asset.country_code]}
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

        <div className="xxs:text-[13px] text-sm">
          <div className="flex justify-between items-center py-1">
            <p className="font-bold">Nativity</p>
            <div className="bg-grayTag h-7 flex justify-center items-center rounded-full px-4 xxs:text-xs text-sm font-bold">
              {asset.nativity ? NEW_NATIVITY_MAP[asset.nativity] : ""}
            </div>
          </div>

          <div className="flex justify-between items-center py-1">
            <p className="font-bold">Subtype</p>
            <div className="bg-grayTag h-7 flex justify-center items-center rounded-full px-4 xxs:text-xs text-sm font-bold">
              {asset.asset_subtypes[0].name}
            </div>
          </div>

          {asset.child_assets.length > 0 && (
            <div className="flex justify-between items-center py-1">
              <p className="font-bold">
                {asset.child_assets.length} Second Order Asset
                {asset.child_assets.length > 1 ? "s" : ""}
              </p>
              <div className="flex gap-2">
                <Link to={`/assets/${asset.child_assets[0].id}`}>
                  <div className="bg-grayTag h-7 flex justify-center items-center rounded-full px-4 xxs:text-xs text-sm font-bold">
                    {asset.child_assets[0].name.length > 20
                      ? `${asset.child_assets[0].name.substring(0, 17)}...`
                      : asset.child_assets[0].name}
                  </div>
                </Link>
                {asset.child_assets.length > 1 && (
                  <div className="bg-grayTag h-7 flex justify-center items-center rounded-full px-4 xxs:text-xs text-sm font-bold">
                    +{asset.child_assets.length - 1}
                  </div>
                )}
              </div>
            </div>
          )}

          {asset.parent_assets.length > 0 && (
            <div className="flex justify-between items-center py-1">
              <p className="font-bold">
                {asset.parent_assets.length} Primary Asset
                {asset.parent_assets.length > 1 ? "s" : ""}
              </p>
              <div className="flex gap-2">
                <Link to={`/assets/${asset.parent_assets[0].id}`}>
                  <div className="bg-grayTag h-7 flex justify-center items-center rounded-full px-4 xxs:text-xs text-sm font-bold">
                    {asset.parent_assets[0].name.length > 20
                      ? `${asset.parent_assets[0].name.substring(0, 17)}...`
                      : asset.parent_assets[0].name}
                  </div>
                </Link>
                {asset.parent_assets.length > 1 && (
                  <div className="bg-grayTag h-7 flex justify-center items-center rounded-full px-4 xxs:text-xs text-sm font-bold">
                    +{asset.parent_assets.length - 1}
                  </div>
                )}
              </div>
            </div>
          )}

          {asset.certifications.length > 0 && (
            <div className="bg-grayButton rounded-lg p-3 flex justify-between mt-2">
              <div>
                <p className="font-bold">Ratings</p>
                <p>
                  {asset.certifications.length} rating
                  {asset.certifications.length > 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex gap-4">
                {asset.certifications.map((certification) => (
                  <div key={certification.id}>
                    <p className="font-bold">{certification.certifier.name}</p>
                    {certification.certification_source ? (
                      <a
                        href={certification.certification_source}
                        className="hover:underline hover:text-primary-300"
                        target="_blank"
                      >
                        <p>
                          {certification.description
                            ? certification.description
                            : certification.value}
                        </p>
                      </a>
                    ) : (
                      <p>
                        {certification.description
                          ? certification.description
                          : certification.value}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div
          className={clsx("flex gap-3 mt-3 justify-between xxs:text-[13px]")}
        >
          {showExternalLink && (asset.issuer_link || asset.exchange_link) && (
            <a
              href={asset.issuer_link || asset.exchange_link}
              target="_blank"
              className="button !bg-grayButton !text-blue-950 max-w-[190px] flex-1 flex justify-center items-center"
            >
              <span className="mr-1">Learn more</span>
              <ArrowUpRight size={16} />
            </a>
          )}
          {!showExternalLink && (
            <Link
              className="flex items-center justify-center w-full flex-1 button button-gradient text-center"
              to={`/assets/${asset.id}`}
            >
              Details
            </Link>
          )}
          {showExternalLink &&
            !celoContractAddress &&
            (asset.issuer_link || asset.exchange_link) && (
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
