import { useParams } from "react-router-dom";
import { Marker } from "react-map-gl";
import { useFiltersState } from "../context/filters";
import AssetCard from "../Explore/AssetCard";
import { MapBox } from "../shared/components/MapBox";
import { useMapState } from "../context/map";
import Footer from "../Footer";
import Header from "../Header";
import { Trading } from "../shared/components/Trading";

export default (): React.ReactElement => {
  const { assetId } = useParams<{ assetId: string }>();
  const { filteredAssets } = useFiltersState();
  const { mapStyle } = useMapState();
  const asset = filteredAssets.find((a) => a.id === assetId);

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
