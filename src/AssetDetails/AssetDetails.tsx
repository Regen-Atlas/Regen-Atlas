import { useParams } from "react-router-dom";
import { Marker } from "react-map-gl";
import { useFiltersState } from "../context/filters";
import AssetCard from "../Explore/AssetCard";
import { MapBox } from "../shared/components/MapBox";
import { useMapState } from "../context/map";

export default (): React.ReactElement => {
  const { assetId } = useParams<{ assetId: string }>();
  const { filteredAssets } = useFiltersState();
  const { mapStyle } = useMapState();
  const asset = filteredAssets.find((a) => a.id === assetId);

  return (
    <div className="main-container">
      <div className="pt-[60px] md:pt-[100px]">
        {!asset && (
          <div className="text-center text-white text-2xl">Asset not found</div>
        )}
        {asset && (
          <div className="grid grid-cols-[500px_1fr] gap-4">
            <AssetCard
              asset={asset}
              onPinClicked={() => {}}
              displayLearnMore={false}
            />
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
      </div>
      <h1>Asset Details: {assetId}</h1>
    </div>
  );
};
