import { Marker, Popup } from "react-map-gl";
import type { MapRef } from "react-map-gl";
import FiltersMobile from "./FiltersMobile";
import { useNewFiltersDispatch, useNewFiltersState } from "../context/filters";
import clsx from "clsx";
import Footer from "../Footer";
import { useEffect, useRef, useState } from "react";
import { useMapState } from "../context/map";
import { MapBox } from "../shared/components/MapBox";
import Header from "../Header";
import { NewAsset } from "../shared/types";
import NewAssetCard from "./NewAssetCard";

export default (): React.ReactElement => {
  const { filteredAssets, filters, selectedAssetId } = useNewFiltersState();
  const dispatch = useNewFiltersDispatch();
  const [openPopupAssetId, setOpenPopupAssetId] = useState<string | null>(null);
  const mapRef = useRef<MapRef>();
  const { mapStyle } = useMapState();

  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
  }, [filters, selectedAssetId]);

  const handleMarkerClick = (assetId: string) => {
    setOpenPopupAssetId(assetId);
    dispatch({ type: "SET_SELECTED_ASSET", payload: assetId });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAssetCardPinClick = (asset: NewAsset) => {
    setOpenPopupAssetId(asset.id);
    mapRef?.current?.flyTo({
      center: [asset.coordinates.longitude, asset?.coordinates?.latitude],
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
    <>
      <Header showFilters={true} />
      <div className="main-container">
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
              <MapBox
                mapStyle={mapStyle}
                initialViewState={{
                  longitude: 15,
                  latitude: 30,
                  zoom: 1,
                }}
                showMapStyleSwitch={true}
                mapRef={mapRef as React.RefObject<MapRef>}
              >
                {filteredAssets
                  .filter((asset) => !asset.second_order)
                  .map((asset) => (
                    <div key={asset.id}>
                      <Marker
                        key={asset.id}
                        latitude={asset?.coordinates?.latitude}
                        longitude={asset?.coordinates?.longitude}
                        onClick={(e) => {
                          e.originalEvent.stopPropagation();
                          handleMarkerClick(asset.id);
                        }}
                      />
                      {openPopupAssetId === asset.id && (
                        <Popup
                          latitude={asset?.coordinates?.latitude}
                          longitude={asset?.coordinates?.longitude}
                          closeButton={false}
                        >
                          <div className="font-bold">{asset?.name}</div>
                        </Popup>
                      )}
                    </div>
                  ))}
              </MapBox>
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
              <NewAssetCard
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
    </>
  );
};
