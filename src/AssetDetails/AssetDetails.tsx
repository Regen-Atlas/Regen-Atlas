import { Link, useParams } from "react-router-dom";
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
import { NewAsset } from "../shared/types";
import NewAssetCard from "../Explore/NewAssetCard";
import React, { useState } from "react";
import { ArrowsSplit, Coins } from "@phosphor-icons/react";

export default (): React.ReactElement => {
  const [openPopupAssetId, setOpenPopupAssetId] = useState<string | null>(null);
  const { assetId } = useParams<{ assetId: string }>();
  const { mapStyle } = useMapState();
  // Fetch the asset
  const { item: asset } = useSupabaseItemById<NewAsset>("assets_all", assetId);

  if (!asset) {
    return <div>Asset not found</div>;
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
        <div className="pt-[60px] md:pt-[100px]">
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
              </div>
              <div>
                <MapBox
                  mapStyle={mapStyle}
                  initialViewState={{
                    longitude: asset.coordinates.longitude,
                    latitude: asset.coordinates.latitude,
                    zoom: 5,
                  }}
                >
                  <Marker
                    key={asset.id}
                    latitude={asset.coordinates.latitude}
                    longitude={asset.coordinates.longitude}
                    onClick={(e) => {
                      e.originalEvent.stopPropagation();
                      setOpenPopupAssetId(asset.id);
                    }}
                  >
                    <div className="w-14 h-14 rounded-full bg-primary-300 border-primary-500 border-2 flex justify-center items-center shadow-md text-white">
                      <Coins size={40} />
                    </div>
                    {openPopupAssetId === asset.id && (
                      <Popup
                        latitude={asset?.coordinates?.latitude}
                        longitude={asset?.coordinates?.longitude}
                        closeButton={false}
                      >
                        <div>
                          {asset.parent_assets.length === 0 && (
                            <div className="font-bold">Primary asset</div>
                          )}
                          <div className="font-medium text-base">
                            {asset?.name}
                          </div>
                        </div>
                      </Popup>
                    )}
                  </Marker>
                  {asset.child_assets?.map((childAsset) => (
                    <div key={childAsset.id}>
                      <Marker
                        key={childAsset.id}
                        latitude={childAsset.coordinates.latitude}
                        longitude={childAsset.coordinates.longitude}
                        onClick={(e) => {
                          e.originalEvent.stopPropagation();
                          setOpenPopupAssetId(childAsset.id);
                        }}
                      >
                        <div className="w-8 h-8 rounded-full bg-primary-100 border-primary-300 border-2 flex justify-center items-center shadow-md">
                          <ArrowsSplit size={24} className="-rotate-90" />
                        </div>
                        {openPopupAssetId === childAsset.id && (
                          <Popup
                            latitude={childAsset?.coordinates?.latitude}
                            longitude={childAsset?.coordinates?.longitude}
                            closeButton={false}
                          >
                            <div>
                              <div className="font-bold">
                                Second order asset
                              </div>
                              <div className="font-medium text-base">
                                {childAsset?.name}
                              </div>
                              <div className="flex justify-end mt-3">
                                <Link to={`/assets/${childAsset.id}`}>
                                  <button className="button button-gradient h-7 !text-sm !px-4">
                                    Open
                                  </button>
                                </Link>
                              </div>
                            </div>
                          </Popup>
                        )}
                      </Marker>
                    </div>
                  ))}
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
