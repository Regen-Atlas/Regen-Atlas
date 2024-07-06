import Map, { Marker, Popup } from "react-map-gl";
import type { MapRef } from "react-map-gl";
import AssetCard from "./AssetCard";
import FiltersMobile from "./FiltersMobile";
import { useFiltersDispatch, useFiltersState } from "../context/filters";
import clsx from "clsx";
import Footer from "../Footer";
import { useEffect, useRef, useState } from "react";
import { Asset } from "../shared/types";

export default (): React.ReactElement => {
  const { filteredAssets, filters, selectedAssetId } = useFiltersState();
  const dispatch = useFiltersDispatch();
  const [openPopupAssetId, setOpenPopupAssetId] = useState<string | null>(null);
  const mapRef = useRef<MapRef>();

  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
  }, [filters, selectedAssetId]);

  const handleMarkerClick = (assetId: string) => {
    setOpenPopupAssetId(assetId);
    dispatch({ type: "SET_SELECTED_ASSET", payload: assetId });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAssetCardPinClick = (asset: Asset) => {
    setOpenPopupAssetId(asset.id);
    mapRef?.current?.flyTo({
      center: [asset.geolocation.longitude, asset.geolocation.latitude],
      zoom: 10,
    });
  };

  const showCards = () => {
    return (
      Object.keys(filters.assetTypes).length > 0 ||
      filters.provider ||
      filters.chainId ||
      selectedAssetId
    );
  };

  return (
    <div className="bg-background max-w-[1224px] mx-auto px-3 md:px-4 pb-2 md:pb-0">
      <div
        className={clsx(
          "pt-[60px] md:pt-[140px] lg:pt-[100px]",
          "md:grid md:grid-cols-2 lg:grid-cols-[1fr_600px] xl:grid-cols-[1fr_740px] md:gap-4"
        )}
      >
        <div
          className={clsx(
            "md:order-3 md:self-start md:row-start-2 md:row-end-3 lg:row-start-1 lg:row-end-2",
            !showCards() && "md:!col-span-2"
          )}
        >
          <div
            className={clsx(
              "w-full rounded-xl overflow-hidden",
              "map-wrapper",
              showCards() &&
                "md:fixed md:top-[156px] md:w-[calc(50vw-32px)] md:h-[calc(100vh-140px)]",
              showCards() && "lg:h-[calc(100vh-100px)]",
              showCards() && "lg:top-[100px] lg:w-[600px] xl:w-[740px]"
            )}
          >
            <div
              className={clsx(
                "w-full rounded-xl overflow-hidden",
                "map-wrapper"
              )}
            >
              <Map
                ref={mapRef as React.RefObject<MapRef>}
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
                  <div key={asset.id}>
                    <Marker
                      key={asset.id}
                      latitude={asset.geolocation.latitude}
                      longitude={asset.geolocation.longitude}
                      onClick={(e) => {
                        e.originalEvent.stopPropagation();
                        handleMarkerClick(asset.id);
                      }}
                    />
                    {openPopupAssetId === asset.id && (
                      <Popup
                        latitude={asset.geolocation.latitude}
                        longitude={asset.geolocation.longitude}
                        closeButton={false}
                      >
                        <div className="font-bold">{asset.name}</div>
                      </Popup>
                    )}
                  </div>
                ))}
              </Map>
            </div>
            <div className="hidden md:block">
              <Footer />
            </div>
          </div>
        </div>
        <div
          className={clsx(
            "h-[60px] z-10 md:row-start-1 md:row-end-2 md:order-1 md:col-span-2 lg:hidden",
            "md:h-0"
          )}
        >
          <div
            className={clsx(
              "filters-row-mobile bg-background",
              "md:fixed md:!top-[80px] md:left-0 md:w-full md:!px-4"
            )}
          >
            <FiltersMobile />
          </div>
        </div>
        <div
          className={clsx(
            "md:order-2 md:row-start-2 lg:row-start-1 lg:row-end-2 md:row-end-3",
            !showCards() && "md:hidden"
          )}
        >
          {filteredAssets.map((asset) => (
            <AssetCard
              key={asset.id}
              className="mb-4"
              asset={asset}
              onPinClicked={() => {
                handleAssetCardPinClick(asset);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
