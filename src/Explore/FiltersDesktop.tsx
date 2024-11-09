import { useState } from "react";
import clsx from "clsx";
import FiltersDropdown from "./components/FiltersDropdown";
import { useNewFiltersState } from "../context/filters";
import { useBaseState } from "../context/base";

export default (): React.ReactElement => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<
    "assetType" | "issuers" | "chains"
  >("assetType");
  const { filters } = useNewFiltersState();
  const base = useBaseState();

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
          "w-[640px] h-10 gap-2 relative",
          "grid grid-cols-3 rounded-full p-1",
          "bg-cardBackground border-[1px] border-white"
        )}
      >
        <div
          className={clsx(
            "flex items-center justify-center rounded-full bg-white text-blue-950 cursor-pointer",
            "hover:bg-gray-300 transition-all"
          )}
          onClick={() => {
            setSelectedFilter("assetType");
            setIsDropdownOpen(!isDropdownOpen);
          }}
        >
          {accumulateSubtypes().length === 0 ? (
            <div>Type</div>
          ) : (
            <div>{accumulateSubtypes().length} types selected</div>
          )}
        </div>

        <div
          className={clsx(
            "flex items-center justify-center rounded-full bg-white text-blue-950 cursor-pointer",
            "hover:bg-gray-300 transition-all"
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

        <div
          className={clsx(
            "flex items-center justify-center rounded-full bg-white text-blue-950 cursor-pointer",
            "hover:bg-gray-300 transition-all"
          )}
          onClick={() => {
            setSelectedFilter("chains");
            setIsDropdownOpen(!isDropdownOpen);
          }}
        >
          {filters.chainId
            ? base.chains.find((chain) => chain.id === filters.chainId)?.name ||
              "Unknown chain"
            : "Chain"}
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
