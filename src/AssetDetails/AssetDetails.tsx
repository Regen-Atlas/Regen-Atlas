import { useParams } from "react-router-dom";
import { Marker } from "react-map-gl";
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

export default (): React.ReactElement => {
  const { assetId } = useParams<{ assetId: string }>();
  const { mapStyle } = useMapState();
  // Fetch the asset
  const { item: asset } = useSupabaseItemById<NewAsset>(
    "assets_published",
    assetId
  );

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
                <NewAssetCard
                  asset={asset}
                  onPinClicked={() => {}}
                  showBuyButton={!celoContractAddress}
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
                  />
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
