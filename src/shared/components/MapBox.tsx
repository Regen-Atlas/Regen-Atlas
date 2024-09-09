import { Ref, useRef } from "react";
import Map from "react-map-gl";
import type { MapRef } from "react-map-gl";
import clsx from "clsx";
import { MapStyleSwitch } from "./MapStyleSwitch";
import { MAP_STYLES } from "../consts";
import { MapStyles } from "../types";

interface MapBoxProps {
  children?: React.ReactNode;
  mapStyle: MapStyles;
  showMapStyleSwitch?: boolean;
  initialViewState: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  mapRef?: Ref<MapRef>;
}

export const MapBox = ({
  children,
  mapStyle,
  showMapStyleSwitch = true,
  initialViewState,
  mapRef,
}: MapBoxProps): React.ReactElement => {
  if (!mapRef) {
    mapRef = useRef<MapRef>() as Ref<MapRef>;
  }

  return (
    <div
      className={clsx(
        "w-full rounded-xl overflow-hidden relative",
        "map-wrapper"
      )}
    >
      {showMapStyleSwitch && (
        <div className="absolute top-2 left-2 z-10">
          <MapStyleSwitch />
        </div>
      )}
      <Map
        ref={mapRef as React.RefObject<MapRef>}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string}
        initialViewState={initialViewState}
        mapStyle={MAP_STYLES[mapStyle]}
      >
        {children}
      </Map>
    </div>
  );
};
