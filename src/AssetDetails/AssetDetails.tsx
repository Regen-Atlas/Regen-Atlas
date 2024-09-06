import { useParams } from "react-router-dom";
import { Marker } from "react-map-gl";
import { useFiltersState } from "../context/filters";
import AssetCard from "../Explore/AssetCard";
import { MapBox } from "../shared/components/MapBox";
import { useMapState } from "../context/map";
import Footer from "../Footer";
import Header from "../Header";
import {
  CELO_TOKENS_MAP,
  CELO_USDC_TOKEN,
  UniswapTrading,
} from "../modules/uniswap";

export default (): React.ReactElement => {
  const { assetId } = useParams<{ assetId: string }>();
  const { filteredAssets } = useFiltersState();
  const { mapStyle } = useMapState();
  const asset = filteredAssets.find((a) => a.id === assetId);

  const celoContractAddress: string =
    asset?.tokens?.find((t) => t.chainId === 42220)?.contractAddress || "";

  const tokenIn = CELO_USDC_TOKEN;
  const tokenOut = CELO_TOKENS_MAP[celoContractAddress];

  return (
    <>
      <Header />
      <div className="main-container">
        <div className="pt-[60px] md:pt-[100px]">
          {!asset && (
            <div className="text-center text-white text-2xl">
              Asset not found
            </div>
          )}
          {asset && (
            <div className="grid grid-cols-[500px_1fr] gap-4">
              <div>
                <AssetCard asset={asset} onPinClicked={() => {}} />
                {celoContractAddress && tokenOut && (
                  <div className="p-4 flex justify-center">
                    <div className="max-w-[340px]">
                      <UniswapTrading tokenIn={tokenIn} tokenOut={tokenOut} />
                    </div>
                  </div>
                )}
              </div>
              <div>
                <MapBox
                  mapStyle={mapStyle}
                  initialViewState={{
                    longitude: asset.geolocation.longitude,
                    latitude: asset.geolocation.latitude,
                    zoom: 5,
                  }}
                >
                  <Marker
                    key={asset.id}
                    latitude={asset.geolocation.latitude}
                    longitude={asset.geolocation.longitude}
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
