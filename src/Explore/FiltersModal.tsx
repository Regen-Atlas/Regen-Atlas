import { useState } from "react";
import { useFiltersDispatch, useFiltersState } from "../context/filters";
import FilterSummaryMobile from "./components/FilterSummaryMobile";
import { ASSET_TYPES } from "../shared/consts";
import { Modal } from "../shared/components/Modal";
import TypeSummary from "./components/TypeSummary";
import clsx from "clsx";
import { CheckboxBox } from "../shared/components";
import { PROVIDER_LIST, PROVIDER_MAP } from "../shared/consts/provider";
import { CHAINS, CHAIN_MAPPING } from "../shared/consts/chains";

export default (): JSX.Element => {
  const [openFilters, setOpenFilters] = useState({
    type: false,
    issuers: false,
    chains: false,
  });
  const [openType, setOpenType] = useState<string>("");
  const { filters } = useFiltersState();
  const dispatchFilters = useFiltersDispatch();

  const handleToggleTypeFilter = () => {
    setOpenFilters((prev) => ({ ...prev, type: !prev.type }));
  };

  const handleToggleIssuerFilter = () => {
    setOpenFilters((prev) => ({ ...prev, issuers: !prev.issuers }));
  };

  const handleToggleChainFilter = () => {
    setOpenFilters((prev) => ({ ...prev, chains: !prev.chains }));
  };

  const handleSubtypeClick = ({
    typeId,
    subtypeId,
  }: {
    typeId: string;
    subtypeId: string;
  }) => {
    const selected = filters.assetTypes[typeId]?.subtypes.includes(subtypeId);
    if (!selected) {
      dispatchFilters({
        type: "SET_SUBTYPE_FILTER",
        payload: { typeId, subtypeId },
      });
    } else {
      dispatchFilters({
        type: "REMOVE_SUBTYPE_FILTER",
        payload: { typeId, subtypeId },
      });
    }
  };

  const accumulateSubtypes = () => {
    const subtypes: string[] = [];
    for (const assetType of Object.values(filters.assetTypes)) {
      subtypes.push(...assetType.subtypes);
    }
    return subtypes;
  };

  return (
    <>
      <div className="text-2xl font-semibold mb-6">Filters</div>
      <div className="grid gap-3">
        <FilterSummaryMobile
          onClick={handleToggleTypeFilter}
          title="Type"
          value={
            accumulateSubtypes().length > 0
              ? `${accumulateSubtypes().length} selected`
              : "All"
          }
          defaultValue="All"
        />
        {openFilters.type && (
          <Modal fullScreen onClose={handleToggleTypeFilter}>
            <div className="text-2xl font-semibold mb-6">Asset Types</div>
            <div>
              {ASSET_TYPES.map((type) => {
                const selected = filters.assetTypes[type.id];
                return (
                  <div key={type.id}>
                    <TypeSummary
                      className={clsx("mb-3", selected && "border-blue-950")}
                      onClick={() => {
                        if (!selected) {
                          dispatchFilters({
                            type: "SET_TYPE_FILTER",
                            payload: {
                              id: type.id,
                              name: type.name,
                              subtypes: type.subtypes.map(
                                (subtype) => subtype.id
                              ),
                            },
                          });
                        } else {
                          dispatchFilters({
                            type: "REMOVE_TYPE_FILTER",
                            payload: type.id,
                          });
                        }
                      }}
                      onToggleClick={(e) => {
                        e.stopPropagation();
                        setOpenType((prev) =>
                          prev === type.id ? "" : type.id
                        );
                      }}
                      isOpen={openType === type.id}
                      title={type.name}
                      selectedCount={
                        filters.assetTypes[type.id]?.subtypes?.length
                      }
                    />
                    {openType === type.id && (
                      <div className="pl-8">
                        {type.subtypes.map((subtype) => {
                          return (
                            <div
                              key={subtype.id}
                              className="flex items-center gap-2 cursor-pointer mb-4"
                              onClick={() =>
                                handleSubtypeClick({
                                  typeId: type.id,
                                  subtypeId: subtype.id,
                                })
                              }
                            >
                              <CheckboxBox
                                className="flex-shrink-0"
                                checked={filters.assetTypes[
                                  type.id
                                ]?.subtypes.includes(subtype.id)}
                              />
                              <div>{subtype.name}</div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end mt-8">
              <button className="button" onClick={handleToggleTypeFilter}>
                Set Asset types
              </button>
            </div>
          </Modal>
        )}

        <FilterSummaryMobile
          onClick={handleToggleIssuerFilter}
          title="Issuers"
          value={filters.provider ? PROVIDER_MAP[filters.provider].name : "All"}
          defaultValue="All"
        />
        {openFilters.issuers && (
          <Modal
            fullScreen
            onClose={() =>
              setOpenFilters((prev) => ({ ...prev, issuers: false }))
            }
          >
            <div className="text-2xl font-semibold mb-6">Issuers</div>
            <div className="grid gap-4 pl-8">
              {PROVIDER_LIST.map((provider) => {
                return (
                  <div
                    key={provider.id}
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => {
                      if (filters.provider === provider.id) {
                        dispatchFilters({
                          type: "REMOVE_PROVIDER_FILTER",
                        });
                      } else {
                        dispatchFilters({
                          type: "SET_PROVIDER_FILTER",
                          payload: provider.id,
                        });
                      }
                      setOpenFilters((prev) => ({ ...prev, issuers: false }));
                    }}
                  >
                    <CheckboxBox
                      checked={filters.provider === provider.id}
                      className="flex-shrink-0"
                    />
                    <div>{provider.name}</div>
                  </div>
                );
              })}
            </div>
          </Modal>
        )}
        <FilterSummaryMobile
          onClick={handleToggleChainFilter}
          title="Chains"
          value={filters.chainId ? CHAIN_MAPPING[filters.chainId]?.name : "All"}
          defaultValue="All"
        />
        {openFilters.chains && (
          <Modal fullScreen onClose={handleToggleChainFilter}>
            <div className="text-2xl font-semibold mb-6">Chains</div>
            <div className="grid gap-4 pl-8">
              {CHAINS.map((chain) => {
                return (
                  <div
                    key={chain.id}
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => {
                      if (filters.chainId === chain.id) {
                        dispatchFilters({
                          type: "REMOVE_CHAIN_ID_FILTER",
                        });
                      } else {
                        dispatchFilters({
                          type: "SET_CHAIN_ID_FILTER",
                          payload: chain.id,
                        });
                      }
                      setOpenFilters((prev) => ({ ...prev, chains: false }));
                    }}
                  >
                    <CheckboxBox
                      checked={filters.chainId === chain.id}
                      className="flex-shrink-0"
                    />
                    <div>{chain.name}</div>
                  </div>
                );
              })}
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};
