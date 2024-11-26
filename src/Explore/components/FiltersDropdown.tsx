import clsx from "clsx";
import {
  useNewFiltersDispatch,
  useNewFiltersState,
} from "../../context/filters";
import { CheckboxBox } from "../../shared/components";
import { useBaseState } from "../../context/base";

export default ({
  openFilter,
  onClose,
}: {
  openFilter: "assetType" | "issuers" | "chains";
  onClose: () => void;
}): React.ReactElement => {
  const { filters } = useNewFiltersState();
  const dispatchFilters = useNewFiltersDispatch();
  const base = useBaseState();

  if (!base.chains.length || !base.types.length || !base.issuers.length) {
    return <div>Loading...</div>;
  }

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

  return (
    <div className="fixed left-0 top-0 h-[100vh] w-full" onClick={onClose}>
      <div
        className={clsx(
          "bg-cardBackground rounded-xl p-4",
          "absolute top-[72px]",
          openFilter === "assetType" &&
            "left-[calc((100vw-1000px)/2)] w-[1000px]",
          (openFilter === "issuers" || openFilter === "chains") &&
            "left-[calc((100vw-720px)/2)] w-[720px]"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {openFilter === "assetType" && (
          <div className="grid grid-cols-3 gap-4">
            {base.types.map((assetType) => {
              const selected = filters.assetTypes[assetType.id];
              return (
                <div key={assetType.id}>
                  <div
                    className={clsx(
                      "flex items-center gap-2",
                      "mb-4",
                      "cursor-pointer hover:text-gray-600"
                    )}
                    onClick={() => {
                      // if no provider is selected and the type has no assets, do nothing
                      if (
                        !filters.provider &&
                        !assetType.asset_subtypes.find(
                          (item) =>
                            item?.total_asset_count &&
                            item?.total_asset_count > 0
                        )
                      ) {
                        return;
                      }

                      if (
                        filters.provider &&
                        !assetType.asset_subtypes.find((subtype) =>
                          subtype.issuer_counts?.find(
                            (issuer) => issuer.issuer_id === filters.provider
                          )
                        )
                      ) {
                        return;
                      }

                      if (!selected) {
                        dispatchFilters({
                          type: "SET_TYPE_FILTER",
                          payload: {
                            id: assetType.id,
                            name: assetType.name,
                            subtypes: assetType.asset_subtypes.map(
                              (subtype) => subtype.id
                            ),
                          },
                        });
                      } else {
                        dispatchFilters({
                          type: "REMOVE_TYPE_FILTER",
                          payload: assetType.id,
                        });
                      }
                    }}
                  >
                    <CheckboxBox
                      variant="small"
                      className="!border-blue-950 flex-shrink-0"
                      checked={!!filters.assetTypes[assetType.id]}
                    />
                    <div className="font-bold text-lg">{assetType.name}</div>
                  </div>
                  {assetType.asset_subtypes.map((subtype) => (
                    <div
                      key={subtype.id}
                      className={clsx(
                        "flex items-start gap-2",
                        "ml-4 mb-4",
                        "cursor-pointer hover:text-gray-600"
                      )}
                      onClick={() => {
                        if (
                          !filters.provider &&
                          subtype.total_asset_count === 0
                        ) {
                          return;
                        }
                        if (
                          filters.provider &&
                          !subtype.issuer_counts?.find(
                            (issuer) => issuer.issuer_id === filters.provider
                          )
                        ) {
                          return;
                        }

                        handleSubtypeClick({
                          typeId: assetType.id,
                          subtypeId: subtype.id,
                        });
                      }}
                    >
                      <CheckboxBox
                        variant="small"
                        className="!border-blue-950 flex-shrink-0"
                        checked={filters.assetTypes[
                          assetType.id
                        ]?.subtypes.includes(subtype.id)}
                      />
                      <div
                        className={clsx(
                          "leading-none",
                          !filters.provider &&
                            subtype.total_asset_count === 0 &&
                            "text-gray-400",
                          filters.provider &&
                            !subtype.issuer_counts?.find(
                              (issuer) => issuer.issuer_id === filters.provider
                            ) &&
                            "text-gray-400"
                        )}
                      >
                        {subtype.name}

                        {filters.provider ? (
                          <span>
                            {" "}
                            (
                            {subtype.issuer_counts?.find(
                              (issuer) => issuer.issuer_id === filters.provider
                            )?.asset_count || 0}
                            )
                          </span>
                        ) : (
                          <span> ({subtype.total_asset_count})</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {openFilter === "issuers" && (
          <div className="grid grid-cols-3 gap-4">
            {base.issuers.map((provider) => {
              const selected = filters.provider === provider.id;
              return (
                <div key={provider.id}>
                  <div
                    className={clsx(
                      "flex items-center gap-2",
                      "cursor-pointer hover:text-gray-600"
                    )}
                    onClick={() => {
                      if (selected) {
                        dispatchFilters({
                          type: "REMOVE_PROVIDER_FILTER",
                        });
                      } else {
                        dispatchFilters({
                          type: "SET_PROVIDER_FILTER",
                          payload: provider.id,
                        });
                      }
                    }}
                  >
                    <CheckboxBox
                      variant="small"
                      className="!border-blue-950 flex-shrink-0"
                      checked={selected}
                    />
                    <div className="text-lg">{provider.name}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {openFilter === "chains" && (
          <div className="grid grid-cols-3 gap-4">
            {base.chains.map((chain) => {
              const selected = filters.chainId === chain.id;
              return (
                <div key={chain.id}>
                  <div
                    className={clsx(
                      "flex items-center gap-2",
                      "cursor-pointer hover:text-gray-600"
                    )}
                    onClick={() => {
                      if (selected) {
                        dispatchFilters({
                          type: "REMOVE_CHAIN_ID_FILTER",
                        });
                      } else {
                        dispatchFilters({
                          type: "SET_CHAIN_ID_FILTER",
                          payload: chain.id,
                        });
                      }
                    }}
                  >
                    <CheckboxBox
                      variant="small"
                      className="!border-blue-950 flex-shrink-0"
                      checked={selected}
                    />
                    <div className="text-lg">{chain.name}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
