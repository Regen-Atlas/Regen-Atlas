import { useState } from "react";
import clsx from "clsx";
import FiltersDropdown from "./components/FiltersDropdown";
import { useNewFiltersDispatch, useNewFiltersState } from "../context/filters";
import { useBaseState } from "../context/base";
import { X } from "@phosphor-icons/react";

export default (): React.ReactElement => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<
    "assetType" | "issuers" | "platforms"
  >("assetType");
  const { filters } = useNewFiltersState();
  const base = useBaseState();
  const dispatchFilters = useNewFiltersDispatch();

  const accumulateSubtypes = () => {
    const subtypes: number[] = [];
    for (const assetType of Object.values(filters.assetTypes)) {
      subtypes.push(...assetType.subtypes);
    }
    return subtypes;
  };

  return (
    <div>
      <div
        className={clsx(
          "w-[540px] h-10 gap-2 relative",
          "grid grid-cols-3 rounded-full p-1",
          "bg-cardBackground border-[1px] border-white"
        )}
      >
        <div className="relative">
          {accumulateSubtypes().length > 0 && (
            <div
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-black flex items-center justify-center
                cursor-pointer hover:bg-red-600 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                dispatchFilters({ type: "RESET_TYPE_FILTERS" });
              }}
            >
              <X size={14} color="white" />
            </div>
          )}
          <div
            className={clsx(
              "flex items-center justify-center rounded-full bg-white text-blue-950 cursor-pointer",
              "hover:bg-gray-300 transition-all h-full"
            )}
            onClick={() => {
              setSelectedFilter("assetType");
              setIsDropdownOpen(!isDropdownOpen);
            }}
          >
            {accumulateSubtypes().length === 0 ? (
              <div>Type</div>
            ) : (
              <div>Type ({accumulateSubtypes().length} selected)</div>
            )}
          </div>
        </div>

        <div className="relative">
          {filters.provider && (
            <div
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-black flex items-center justify-center
                cursor-pointer hover:bg-red-600 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                dispatchFilters({ type: "RESET_PROVIDER_FILTER" });
              }}
            >
              <X size={14} color="white" />
            </div>
          )}
          <div
            className={clsx(
              "flex items-center justify-center rounded-full bg-white text-blue-950 cursor-pointer",
              "hover:bg-gray-300 transition-all h-full"
            )}
            onClick={() => {
              setSelectedFilter("issuers");
              setIsDropdownOpen(!isDropdownOpen);
            }}
          >
            {filters.provider
              ? base.issuers.find((issuer) => issuer.id === filters.provider)
                  ?.name || "Unknown Issuer"
              : "Issuer"}
          </div>
        </div>

        <div className="relative">
          {filters.platform && (
            <div
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-black flex items-center justify-center
                cursor-pointer hover:bg-red-600 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                dispatchFilters({ type: "RESET_PLATFORM_FILTER" });
              }}
            >
              <X size={14} color="white" />
            </div>
          )}
          <div
            className={clsx(
              "flex items-center justify-center rounded-full bg-white text-blue-950 cursor-pointer",
              "hover:bg-gray-300 transition-all h-full"
            )}
            onClick={() => {
              setSelectedFilter("platforms");
              setIsDropdownOpen(!isDropdownOpen);
            }}
          >
            {filters.platform
              ? base.platforms.find(
                  (platform) => platform.id === filters.platform
                )?.name || "Unknown chain"
              : "Chain"}
          </div>
        </div>

        {isDropdownOpen && (
          <FiltersDropdown
            onClose={() => setIsDropdownOpen(false)}
            openFilter={selectedFilter}
          />
        )}
      </div>
    </div>
  );
};
