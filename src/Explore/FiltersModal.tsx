import { useState } from "react";
import { useNewFiltersDispatch, useNewFiltersState } from "../context/filters";
import FilterSummaryMobile from "./components/FilterSummaryMobile";
import { Modal } from "../shared/components/Modal";
import TypeSummary from "./components/TypeSummary";
import clsx from "clsx";
import { CheckboxBox } from "../shared/components";
import { useBaseState } from "../context/base";

export default ({ onClose }: { onClose: () => void }): JSX.Element => {
  const [openFilters, setOpenFilters] = useState({
    type: false,
    issuers: false,
    chains: false,
  });
  const [openType, setOpenType] = useState<number>();
  const { filters } = useNewFiltersState();
  const base = useBaseState();

  console.log("BAAASE", base);

  if (!base.chains.length || !base.types.length || !base.issuers.length) {
    return <div>Loading...</div>;
  }

  const dispatchFilters = useNewFiltersDispatch();

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
    typeId: number;
    subtypeId: number;
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
    const subtypes: number[] = [];
    for (const assetType of Object.values(filters.assetTypes)) {
      subtypes.push(...assetType.subtypes);
    }
    return subtypes;
  };

  return (
    <div className="flex flex-col h-full pb-24">
      <div className="text-2xl font-semibold mb-6">Filters</div>
      <div className="grid gap-3">
        <FilterSummaryMobile
          onClick={handleToggleTypeFilter}
          className={clsx(
            Object.keys(filters.assetTypes).length > 0 && "!border-blue-950"
          )}
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
            <div className="flex flex-col h-full pb-24">
              <div className="text-2xl font-semibold mb-6">Asset Types</div>
              <div>
                {base.types.map((type) => {
                  const selected = filters.assetTypes[type.id];
                  return (
                    <div key={type.id}>
                      <TypeSummary
                        className={clsx("mb-3", selected && "!border-blue-950")}
                        onClick={() => {
                          if (!selected) {
                            dispatchFilters({
                              type: "SET_TYPE_FILTER",
                              payload: {
                                id: type.id,
                                name: type.name,
                                subtypes: type.asset_subtypes.map(
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
                            prev === type.id ? undefined : type.id
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
                          {type.asset_subtypes.map((subtype) => {
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
              <div className="flex justify-end mt-auto">
                <button
                  className="button button-gradient"
                  onClick={handleToggleTypeFilter}
                >
                  Set Asset types
                </button>
              </div>
            </div>
          </Modal>
        )}

        <FilterSummaryMobile
          onClick={handleToggleIssuerFilter}
          className={clsx(filters.provider && "!border-blue-950")}
          title="Issuers"
          value={
            filters.provider
              ? base.issuers.find((issuer) => issuer.id === filters.provider)
                  ?.name || "Unknown issuer"
              : "All"
          }
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
              {base.issuers.map((provider) => {
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
          className={clsx(filters.chainId && "!border-blue-950")}
          title="Chains"
          value={
            filters.chainId
              ? base.chains.find((chain) => chain.id === filters.chainId)
                  ?.name || "Unknown chain"
              : "All"
          }
          defaultValue="All"
        />
        {openFilters.chains && (
          <Modal fullScreen onClose={handleToggleChainFilter}>
            <div className="text-2xl font-semibold mb-6">Chains</div>
            <div className="grid gap-4 pl-8">
              {base.chains.map((chain) => {
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
      <div className="flex justify-between mt-auto">
        <button
          className="button button-gray !px-8"
          onClick={() => {
            dispatchFilters({
              type: "RESET_FILTERS",
            });
          }}
        >
          Clear
        </button>

        <button className="button button-gradient !px-8" onClick={onClose}>
          Filter
        </button>
      </div>
    </div>
  );
};
