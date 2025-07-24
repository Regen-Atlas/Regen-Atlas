import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { MapBox } from "../shared/components/MapBox";
import { useMapState } from "../context/map";
import Footer from "../Footer";
import Header from "../Header";
import {
  CELO_TOKENS_MAP,
  TOKEN_POOL_TOKEN_MAP,
  UniswapTrading,
} from "../modules/uniswap";
import { useSupabaseItemById } from "../shared/hooks/useSupabaseItemById";
import { useSupabaseItemsByIds } from "../shared/hooks/useSupabaseItemsByIds";
import { Asset, RelatedAsset } from "../modules/assets";
import NewAssetCard from "../Explore/NewAssetCard";
import React, { useState } from "react";
import { AssetRetirement } from "./AssetRetirement";
import { ClusteredAssetLayer } from "../shared/components/ClusteredAssetLayer";
import type { Address } from "viem";

export default (): React.ReactElement => {
  const [openPopupAssetId, setOpenPopupAssetId] = useState<string | null>(null);
  const [openedSecondOrderAsset, setOpenedSecondOrderAsset] = useState<RelatedAsset | null>(null);

  const { assetId } = useParams<{ assetId: string }>();
  const navigate = useNavigate();
  const { mapStyle } = useMapState();

  const { item: asset } = useSupabaseItemById<Asset>(
    "assets_published_view",
    assetId
  );

  const parentAssetIds =
    asset?.second_order && asset.parent_assets
      ? asset.parent_assets.map((p) => p.id)
      : [];

  const { items: fullParentAssets } = useSupabaseItemsByIds<Asset>(
    "assets_published_view",
    parentAssetIds
  );

  const celoContractAddress: Address | undefined = asset?.tokens[0]?.platforms
    ?.find((platform) => platform.id === "celo")
    ?.contract_address.toLowerCase() as Address;

  const tokenIn = celoContractAddress
    ? TOKEN_POOL_TOKEN_MAP[celoContractAddress]
    : "";
  const tokenOut = celoContractAddress
    ? CELO_TOKENS_MAP[celoContractAddress]
    : "";

  const celoRetireWalletAddress: Address = asset?.metadata?.celo_retire_wallet_address as Address;

  const handleAssetOpenClick = (id: string) => {
    console.log("Navigating to:", id);
    navigate(`/assets/${id}`);
    setOpenedSecondOrderAsset(null);
    setOpenPopupAssetId(null);
  };

  if (!asset) {
    return (
      <div className="w-svw h-svh flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const renderAssetLayer = () => {
    if (!asset.second_order) {
      return (
        <ClusteredAssetLayer
          assets={[asset]}
          onAssetClick={(clickedAssetId: string) => handleAssetOpenClick(clickedAssetId)}
        />
      );
    } else if (fullParentAssets.length > 0) {
      return (
        <ClusteredAssetLayer
          assets={fullParentAssets}
          onAssetClick={(clickedAssetId: string) => handleAssetOpenClick(clickedAssetId)}
        />
      );
    }
    return null;
  };

  return (
    <>
      <Helmet>
        <title>{asset.name}</title>
        <meta
          name="description"
          content={`${asset.description.substring(0, 160)}...`}
        />
      </Helmet>
      <Header />
      <div className="main-container">
        <div className="pt-[60px] md:pt-[80px]">
          <div className="grid lg:grid-cols-[440px_1fr] md:grid-cols-2 gap-4">
            <div>
              {asset.parent_assets.length > 0 && (
                <div className="bg-primary-400 text-white rounded-2xl h-8 w-[200px] font-bold flex justify-center items-center mb-4">
                  Second Order Asset
                </div>
              )}
              <NewAssetCard
                asset={asset}
                onPinClicked={() => {}}
                showExternalLink={true}
              />
              {celoContractAddress && tokenIn && tokenOut && (
                <div className="flex justify-center mt-4">
                  <div className="w-full">
                    <UniswapTrading tokenPair={[tokenIn, tokenOut]} />
                  </div>
                </div>
              )}
              {celoRetireWalletAddress && (
                <div className="mt-4">
                  <AssetRetirement retirementWallet={celoRetireWalletAddress} />
                </div>
              )}
            </div>
            <div>
              <MapBox
                mapStyle={mapStyle}
                initialViewState={{
                  longitude: asset.second_order
                    ? 15
                    : asset.coordinates.longitude,
                  latitude: asset.second_order
                    ? 30
                    : asset.coordinates.latitude,
                  zoom: asset.second_order ? 1 : 5,
                }}
              >
                {renderAssetLayer()}
              </MapBox>
            </div>
          </div>
          <div className="hidden md:block">
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};
