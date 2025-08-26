import type { MapRef } from "react-map-gl";
import FiltersMobile from "./FiltersMobile";
import { useNewFiltersDispatch, useNewFiltersState } from "../context/filters";
import clsx from "clsx";
import Footer from "../Footer";
import { useEffect, useRef } from "react";
import { useMapState } from "../context/map";
import { MapBox } from "../shared/components/MapBox";
import Header from "../Header";
import NewAssetCard from "./NewAssetCard";
import { Asset } from "../modules/assets";
import { ClusteredAssetLayer } from "../shared/components/ClusteredAssetLayer";

export default (): React.ReactElement => {
  const { filteredAssets, filters, selectedAssetId } = useNewFiltersState();
  const dispatch = useNewFiltersDispatch();
  const mapRef = useRef<MapRef>();
  const { mapStyle } = useMapState();

  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
  }, [filters, selectedAssetId]);

  const handleAssetCardPinClick = (asset: Asset) => {
    dispatch({ type: "SET_SELECTED_ASSET", payload: asset.id });
    mapRef?.current?.flyTo({
      center: [asset.coordinates.longitude, asset?.coordinates?.latitude],
      zoom: 10,
    });
  };

  const showCards = () => {
    return (
      Object.keys(filters.assetTypes).length > 0 ||
      filters.provider ||
      filters.platform ||
      selectedAssetId
    );
  };

  return (
    <>
      <Header showFilters={true} />
      <div className="main-container">
        <div
          className={clsx(
            "pt-[60px] md:pt-[140px] lg:pt-[80px]",
            "md:grid md:grid-cols-2 lg:grid-cols-[444px_1fr] xl:grid-cols-[444px_1fr] md:gap-4"
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
                showCards() && "lg:h-[calc(100vh-80px)]",
                showCards() && "lg:top-[80px] lg:w-[calc(100vw-507px)]"
              )}
            >
              <MapBox
                mapStyle={mapStyle}
                initialViewState={{
                  longitude: 15,
                  latitude: 30,
                  zoom: 1.6,
                }}
                showMapStyleSwitch={true}
                mapRef={mapRef as React.RefObject<MapRef>}
              >
                <div className="hidden lg:flex absolute top-2 right-2 rounded-full h-7 px-3 items-center bg-blue-950 text-white font-semibold">
                  {filteredAssets.length} assets listed
                </div>

                <ClusteredAssetLayer
                  assets={filteredAssets.filter((asset) => !asset.second_order)}
                />
              </MapBox>
              <div
                className={`hidden lg:block ${!!showCards() && "w-[100vw] fixed left-0 bottom-0 z-50 bg-background pr-8 h-[80px]"}`}
              >
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
                "md:fixed md:!top-[70px] md:left-0 md:w-full md:!px-4"
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
