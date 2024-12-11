import { useNavigate, useParams } from "react-router-dom";
import { Marker, Popup } from "react-map-gl";
import { Address } from "viem";
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
import { NewAsset, RelatedAsset } from "../shared/types";
import NewAssetCard from "../Explore/NewAssetCard";
import React, { useState } from "react";
import { AssetsOrbit } from "./AssetsOrbit";
import { AssetRetirement } from "./AssetRetirement";

export default (): React.ReactElement => {
  const [openPopupAssetId, setOpenPopupAssetId] = useState<string | null>(null);
  const [openedSecondOrderAsset, setOpenedSecondOrderAsset] =
    useState<RelatedAsset | null>(null);
  const { assetId } = useParams<{ assetId: string }>();
  const navigate = useNavigate();
  const { mapStyle } = useMapState();
  // Fetch the asset
  const { item: asset } = useSupabaseItemById<NewAsset>(
    "assets_published",
    assetId
  );

  if (!asset) {
    return <div>Loading...</div>;
  }

  const celoContractAddress: Address | undefined = asset?.tokens?.find(
    (t) => t.chain_id === "42220"
  )?.address as Address;

  const tokenIn = celoContractAddress
    ? TOKEN_POOL_TOKEN_MAP[celoContractAddress]
    : "";
  const tokenOut = celoContractAddress
    ? CELO_TOKENS_MAP[celoContractAddress]
    : "";

  const celoRetireWalletAddress: Address = asset.metadata
    ?.celo_retire_wallet_address as Address;

  console.log("celoRetireWalletAddress", celoRetireWalletAddress);

  const handleAssetOpenClick = (id: string) => {
    navigate(`/assets/${id}`);
    setOpenedSecondOrderAsset(null);
    setOpenPopupAssetId(null);
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
          {!asset && (
            <div className="text-center text-white text-2xl">
              Asset not found
            </div>
          )}
          {asset && (
            <div className="grid lg:grid-cols-[440px_1fr] md:grid-cols-2 gap-4">
              <div>
                {asset.parent_assets.length > 0 && (
                  <div
                    className="bg-primary-400 text-white rounded-2xl h-8 w-[200px]
                    font-bold flex justify-center items-center mb-4"
                  >
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
                    <AssetRetirement
                      retirementWallet={celoRetireWalletAddress}
                    />
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
                  {!asset.second_order && (
                    <Marker
                      key={asset.id}
                      latitude={asset.coordinates.latitude}
                      longitude={asset.coordinates.longitude}
                    >
                      {asset.child_assets.length > 0 && (
                        <AssetsOrbit
                          primaryAsset={asset}
                          secondOrderAssets={asset.child_assets}
                          onPrimaryAssetClick={(assetId) => {
                            console.log("Primary asset clicked", assetId);
                            setOpenedSecondOrderAsset(null);
                            setOpenPopupAssetId(assetId);
                          }}
                          onSecondOrderAssetClick={(selectedAsset) => {
                            setOpenPopupAssetId(null);
                            setOpenedSecondOrderAsset(selectedAsset);
                          }}
                        />
                      )}
                      {openPopupAssetId === asset.id && (
                        <Popup
                          latitude={asset?.coordinates?.latitude}
                          longitude={asset?.coordinates?.longitude}
                          closeButton={false}
                          onClose={() => setOpenPopupAssetId(null)}
                        >
                          <div>
                            {asset.parent_assets.length === 0 &&
                              asset.child_assets.length > 0 && (
                                <div className="font-bold">Primary asset</div>
                              )}
                            <div className="font-medium text-base">
                              {asset?.name}
                            </div>
                          </div>
                        </Popup>
                      )}
                      {openedSecondOrderAsset && (
                        <Popup
                          latitude={asset?.coordinates?.latitude}
                          longitude={asset?.coordinates?.longitude}
                          onClose={() => {
                            setOpenPopupAssetId(null);
                            setOpenedSecondOrderAsset(null);
                          }}
                          className="second-order-asset-popup"
                          anchor="center"
                        >
                          <div>
                            <div className="font-bold">Second order asset</div>
                            <div className="font-medium text-base">
                              {openedSecondOrderAsset?.name}
                            </div>
                            <div className="flex justify-end mt-3">
                              <button
                                className="button button-gradient h-7 !text-sm !px-4"
                                onClick={() =>
                                  handleAssetOpenClick(
                                    openedSecondOrderAsset.id
                                  )
                                }
                              >
                                Open
                              </button>
                            </div>
                          </div>
                        </Popup>
                      )}
                    </Marker>
                  )}
                  {asset.second_order &&
                    asset.parent_assets.map((parentAsset) => {
                      return (
                        <Marker
                          key={parentAsset.id}
                          latitude={parentAsset.coordinates.latitude}
                          longitude={parentAsset.coordinates.longitude}
                          onClick={(e) => {
                            e.originalEvent.stopPropagation();
                            setOpenPopupAssetId(parentAsset.id);
                          }}
                        >
                          {openPopupAssetId === parentAsset.id && (
                            <Popup
                              latitude={parentAsset?.coordinates?.latitude}
                              longitude={parentAsset?.coordinates?.longitude}
                              closeButton={false}
                              onClose={() => setOpenPopupAssetId(null)}
                            >
                              <div>
                                <div className="font-bold">Primary asset</div>
                                <div className="font-medium text-base">
                                  {parentAsset?.name}
                                </div>
                                <div className="flex justify-end mt-3">
                                  <button
                                    className="button button-gradient h-7 !text-sm !px-4"
                                    onClick={() =>
                                      handleAssetOpenClick(parentAsset.id)
                                    }
                                  >
                                    Open
                                  </button>
                                </div>
                              </div>
                            </Popup>
                          )}
                        </Marker>
                      );
                    })}
                </MapBox>
              </div>
            </div>
          )}
          <div className="hidden md:block">
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};
