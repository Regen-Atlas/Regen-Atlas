import Map, { Marker } from "react-map-gl";
import AssetCard from "./AssetCard";
import FiltersMobile from "./FiltersMobile";
import { useFiltersState } from "../context/filters";
import clsx from "clsx";

export default (): React.ReactElement => {
  const { filteredAssets } = useFiltersState();

  const handleMarkerClick = (assetId: string) => {
    console.log(assetId);
  };

  return (
    <div className="bg-background max-w-[1224px] mx-auto px-3 md:px-4 pb-2">
      <div
        className={clsx(
          "pt-[60px] md:pt-[100px]",
          "md:grid md:grid-cols-2 lg:grid-cols-[1fr_600px] xl:grid-cols-[1fr_740px] md:gap-4"
        )}
      >
        <div
          className={clsx(
            "md:order-3 md:self-start md:row-start-2 md:row-end-3 lg:row-start-1 lg:row-end-2"
          )}
        >
          <div
            className={clsx(
              "w-full rounded-xl overflow-hidden",
              "map-wrapper",
              "lg:fixed lg:top-[100px] lg:w-[600px] xl:w-[740px]"
            )}
          >
            <Map
              mapboxAccessToken={
                import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string
              }
              initialViewState={{
                longitude: 15,
                latitude: 30,
                zoom: 1,
              }}
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
        </div>
        <div className="h-[60px] z-10 md:row-start-1 md:row-end-2 md:order-1 md:col-span-2 lg:hidden">
          <div className="filters-row-mobile bg-background">
            <FiltersMobile />
          </div>
        </div>
        <div className="md:order-2 md:row-start-2 lg:row-start-1 lg:row-end-2 md:row-end-3">
          {filteredAssets.map((asset) => (
            <AssetCard key={asset.id} className="mb-4" asset={asset} />
          ))}
        </div>
      </div>
    </div>
  );
};
