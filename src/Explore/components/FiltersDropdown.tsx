import clsx from "clsx";
import { useFiltersDispatch, useFiltersState } from "../../context/filters";
import { CheckboxBox } from "../../shared/components";
import { ASSET_TYPES } from "../../modules/taxonomy";
import { PROVIDER_LIST } from "../../modules/issuers";
import { CHAINS } from "../../modules/chains";

export default ({
  openFilter,
  onClose,
}: {
  openFilter: "assetType" | "issuers" | "chains";
  onClose: () => void;
}): React.ReactElement => {
  const { filters } = useFiltersState();
  const dispatchFilters = useFiltersDispatch();

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

  return (
    <div className="fixed left-0 top-0 h-[100vh] w-full" onClick={onClose}>
      <div
        className={clsx(
          "bg-cardBackground rounded-xl p-4",
          "absolute top-[72px]",
          openFilter === "assetType" &&
            "left-[calc((100vw-960px)/2)] w-[1000px]",
          (openFilter === "issuers" || openFilter === "chains") &&
            "left-[calc((100vw-600px)/2)] w-[640px]"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {openFilter === "assetType" && (
          <div className="grid grid-cols-3 gap-4">
            {ASSET_TYPES.map((assetType) => {
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
                      if (!selected) {
                        dispatchFilters({
                          type: "SET_TYPE_FILTER",
                          payload: {
                            id: assetType.id,
                            name: assetType.name,
                            subtypes: assetType.subtypes.map(
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
                  {assetType.subtypes.map((subtype) => (
                    <div
                      key={subtype.id}
                      className={clsx(
                        "flex items-start gap-2",
                        "ml-4 mb-4",
                        "cursor-pointer hover:text-gray-600"
                      )}
                      onClick={() =>
                        handleSubtypeClick({
                          typeId: assetType.id,
                          subtypeId: subtype.id,
                        })
                      }
                    >
                      <CheckboxBox
                        variant="small"
                        className="!border-blue-950 flex-shrink-0"
                        checked={filters.assetTypes[
                          assetType.id
                        ]?.subtypes.includes(subtype.id)}
                      />
                      <div className="leading-none">{subtype.name}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {openFilter === "issuers" && (
          <div className="grid grid-cols-3 gap-4">
            {PROVIDER_LIST.map((provider) => {
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
            {CHAINS.map((chain) => {
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
