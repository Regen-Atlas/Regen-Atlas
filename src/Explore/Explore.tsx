import Map, { Marker } from "react-map-gl";
import { ALL_ASSETS } from "../data/assets";
import AssetCard from "./AssetCard";
import FiltersMobile from "./FiltersMobile";
import { useFiltersState } from "../context/filters";

export default (): React.ReactElement => {
  const { filteredAssets } = useFiltersState();

  const handleMarkerClick = (assetId: string) => {
    console.log(assetId);
  };

  return (
    <div className="pt-[60px] md:pt-[100px] px-3 bg-gray-100">
      <div className="w-full rounded-xl overflow-hidden">
        <Map
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string}
          initialViewState={{
            longitude: 15,
            latitude: 30,
            zoom: 1,
          }}
          style={{ width: "100%", height: 400 }}
          mapStyle="mapbox://styles/mapbox/light-v11"
        >
          {filteredAssets.map((asset) => (
            <Marker
              key={asset.id}
              latitude={asset.geolocation.latitude}
              longitude={asset.geolocation.longitude}
              onClick={() => handleMarkerClick(asset.id)}
            />
          ))}
        </Map>
      </div>
      <FiltersMobile />
      <div>
        {filteredAssets.map((asset) => (
          <AssetCard key={asset.id} className="mb-4" asset={asset} />
        ))}
      </div>
    </div>
  );
};
