import clsx from "clsx";
import { useMapDispatch, useMapState } from "../../context/map";
import { MapStyles } from "../types";

const mapStyles: Array<MapStyles> = ["map", "satellite"];

export const MapStyleSwitch = (): React.ReactElement => {
  const dispatch = useMapDispatch();
  const { mapStyle } = useMapState();

  return (
    <div className="h-8 lg:h-[38px] border-[1px] border-white rounded-full bg-cardBackground grid grid-cols-2 p-[2px] lg:text-lg">
      {mapStyles.map((style) => (
        <div
          onClick={() =>
            dispatch({
              type: "SET_MAP_STYLE",
              payload: style,
            })
          }
          className={clsx(
            "rounded-full cursor-pointer flex items-center justify-center px-3 capitalize",
            "hover:bg-primary-100 transition-all",
            mapStyle === style && "bg-primary-100"
          )}
        >
          {style}
        </div>
      ))}
    </div>
  );
};
