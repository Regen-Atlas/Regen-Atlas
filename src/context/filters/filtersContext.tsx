import React, { createContext, useReducer, ReactNode, Dispatch } from "react";
import { filterNewAssets } from "./filterAssets";
import { NewAssetTypeFilters, NewFilters } from "../../modules/filters";
import { analytics } from "../../modules/analytics";
import { Asset } from "../../modules/assets";

interface NewState {
  filters: NewFilters;
  filteredAssets: Asset[];
  allAssets: Asset[];
  selectedAssetId: string;
}

type ResetFiltersAction = { type: "RESET_FILTERS" };

type NewSetTypeFilterAction = {
  type: "SET_TYPE_FILTER";
  payload: NewAssetTypeFilters;
};

type NewRemoveTypeFilterAction = {
  type: "REMOVE_TYPE_FILTER";
  payload: number;
};

type ResetTypeFiltersAction = {
  type: "RESET_TYPE_FILTERS";
};

type ResetProviderFilterAction = {
  type: "RESET_PROVIDER_FILTER";
};

type NewSetSubtypeFilterAction = {
  type: "SET_SUBTYPE_FILTER";
  payload: {
    typeId: number;
    subtypeId: number;
  };
};

type NewRemoveSubtypeFilterAction = {
  type: "REMOVE_SUBTYPE_FILTER";
  payload: {
    typeId: number;
    subtypeId: number;
  };
};

type NewSetProviderFilter = {
  type: "SET_PROVIDER_FILTER";
  payload: number;
};

type RemoveProviderFilter = {
  type: "REMOVE_PROVIDER_FILTER";
};

type SetPlatformFilter = {
  type: "SET_PLATFORM_FILTER";
  payload: string;
};

type RemovePlatformFilter = {
  type: "REMOVE_PLATFORM_FILTER";
};

type ResetPlatformFilter = {
  type: "RESET_PLATFORM_FILTER";
};

type SetFlagFilter = {
  type: "SET_FLAG_FILTER";
  payload: {
    flag: "prefinancing" | "pretoken" | "yield_bearing";
    value: boolean | null;
  };
};

type RemoveFlagFilter = {
  type: "REMOVE_FLAG_FILTER";
  payload: "prefinancing" | "pretoken" | "yield_bearing";
};

type ResetFlagsFilter = {
  type: "RESET_FLAGS_FILTER";
};

type SetSelectedAssetAction = {
  type: "SET_SELECTED_ASSET";
  payload: string;
};

type SetAllAssetsAction = { type: "SET_ALL_ASSETS"; payload: Asset[] };

type NewAction =
  | ResetFiltersAction
  | NewSetTypeFilterAction
  | NewRemoveTypeFilterAction
  | NewSetSubtypeFilterAction
  | NewRemoveSubtypeFilterAction
  | NewSetProviderFilter
  | RemoveProviderFilter
  | SetSelectedAssetAction
  | SetAllAssetsAction
  | ResetTypeFiltersAction
  | ResetProviderFilterAction
  | SetPlatformFilter
  | RemovePlatformFilter
  | ResetPlatformFilter
  | SetFlagFilter
  | RemoveFlagFilter
  | ResetFlagsFilter;

const newInitialState: NewState = {
  filters: {
    assetTypes: {},
    provider: null,
    platform: "",
    flags: {
      prefinancing: null,
      pretoken: null,
      yield_bearing: null,
    },
  },
  filteredAssets: [],
  allAssets: [],
  selectedAssetId: "",
};

const newReducer = (state: NewState, action: NewAction): NewState => {
  switch (action.type) {
    case "SET_ALL_ASSETS": {
      return {
        ...state,
        filteredAssets: action.payload,
        allAssets: action.payload,
      };
    }
    case "RESET_FILTERS": {
      return {
        ...state,
        filters: newInitialState.filters,
        selectedAssetId: "",
      };
    }

    case "SET_TYPE_FILTER": {
      analytics.sendFiltersEvent({
        action: "Type Filter",
        label: action.payload.name,
        value: action.payload.id,
      });
      const filters = {
        ...state.filters,
        assetTypes: {
          ...state.filters.assetTypes,
          [action.payload.id]: action.payload,
        },
      };
      return {
        ...state,
        filters,
        filteredAssets: filterNewAssets(state.allAssets, filters),
      };
    }
    case "REMOVE_TYPE_FILTER": {
      const updatedAssetTypes = { ...state.filters.assetTypes };
      delete updatedAssetTypes[action.payload];

      const filters = {
        ...state.filters,
        assetTypes: updatedAssetTypes,
      };

      return {
        ...state,
        filters,
        filteredAssets: filterNewAssets(state.allAssets, filters),
      };
    }

    case "SET_SUBTYPE_FILTER": {
      analytics.sendFiltersEvent({
        action: "Subtype Filter",
        label: `${action.payload.subtypeId}`,
        value: action.payload.subtypeId,
      });

      const filters = {
        ...state.filters,
        assetTypes: {
          ...state.filters.assetTypes,
          [action.payload.typeId]: {
            ...state.filters.assetTypes[action.payload.typeId],
            subtypes: [
              ...(state.filters.assetTypes[action.payload.typeId]?.subtypes ||
                []),
              action.payload.subtypeId,
            ],
          },
        },
      };
      return {
        ...state,
        filters,
        filteredAssets: filterNewAssets(state.allAssets, filters),
      };
    }

    case "REMOVE_SUBTYPE_FILTER": {
      const updatedSubtypes = state.filters.assetTypes[
        action.payload.typeId
      ]?.subtypes.filter((subtype) => subtype !== action.payload.subtypeId);

      const filters = {
        ...state.filters,
        assetTypes: {
          ...state.filters.assetTypes,
          [action.payload.typeId]: {
            ...state.filters.assetTypes[action.payload.typeId],
            subtypes: updatedSubtypes,
          },
        },
      };

      if (!updatedSubtypes?.length) {
        delete filters.assetTypes[action.payload.typeId];
      }

      return {
        ...state,
        filters,
        filteredAssets: filterNewAssets(state.allAssets, filters),
      };
    }

    case "SET_PROVIDER_FILTER": {
      analytics.sendFiltersEvent({
        action: "Issuer Filter",
        label: `${action.payload}`,
        value: action.payload,
      });

      const filters = {
        ...state.filters,
        provider: action.payload,
      };

      return {
        ...state,
        filters,
        filteredAssets: filterNewAssets(state.allAssets, filters),
      };
    }

    case "REMOVE_PROVIDER_FILTER": {
      const filters = {
        ...state.filters,
        provider: null,
      };

      return {
        ...state,
        filters,
        filteredAssets: filterNewAssets(state.allAssets, filters),
      };
    }

    case "SET_SELECTED_ASSET": {
      const filteredAssets = [...state.filteredAssets];
      const selectedAssetIndex = filteredAssets.findIndex(
        (asset) => asset.id === action.payload
      );

      if (selectedAssetIndex === -1) {
        return state;
      }

      if (selectedAssetIndex > 0) {
        const selectedAsset = filteredAssets[selectedAssetIndex];
        filteredAssets.splice(selectedAssetIndex, 1);
        filteredAssets.unshift(selectedAsset);
      }

      return { ...state, selectedAssetId: action.payload, filteredAssets };
    }

    case "RESET_TYPE_FILTERS": {
      const filters = {
        ...state.filters,
        assetTypes: {},
      };

      return {
        ...state,
        filters,
        filteredAssets: filterNewAssets(state.allAssets, filters),
      };
    }

    case "RESET_PROVIDER_FILTER": {
      const filters = {
        ...state.filters,
        provider: null,
      };

      return {
        ...state,
        filters,
        filteredAssets: filterNewAssets(state.allAssets, filters),
      };
    }

    case "SET_PLATFORM_FILTER": {
      analytics.sendFiltersEvent({
        action: "Chain Filter",
        label: action.payload,
      });
      const filters = {
        ...state.filters,
        platform: action.payload,
      };

      return {
        ...state,
        filters,
        filteredAssets: filterNewAssets(state.allAssets, filters),
      };
    }

    case "REMOVE_PLATFORM_FILTER": {
      const filters = {
        ...state.filters,
        platform: "",
      };

      return {
        ...state,
        filters,
        filteredAssets: filterNewAssets(state.allAssets, filters),
      };
    }

    case "RESET_PLATFORM_FILTER": {
      const filters = {
        ...state.filters,
        platform: "",
      };

      return {
        ...state,
        filters,
        filteredAssets: filterNewAssets(state.allAssets, filters),
      };
    }

    case "SET_FLAG_FILTER": {
      analytics.sendFiltersEvent({
        action: "Flag Filter",
        label: action.payload.flag,
        value: action.payload.value === null ? 0 : action.payload.value ? 1 : 0,
      });

      const filters = {
        ...state.filters,
        flags: {
          ...state.filters.flags,
          [action.payload.flag]: action.payload.value,
        },
      };

      return {
        ...state,
        filters,
        filteredAssets: filterNewAssets(state.allAssets, filters),
      };
    }

    case "REMOVE_FLAG_FILTER": {
      const filters = {
        ...state.filters,
        flags: {
          ...state.filters.flags,
          [action.payload]: null,
        },
      };

      return {
        ...state,
        filters,
        filteredAssets: filterNewAssets(state.allAssets, filters),
      };
    }

    case "RESET_FLAGS_FILTER": {
      const filters = {
        ...state.filters,
        flags: {
          prefinancing: null,
          pretoken: null,
          yield_bearing: null,
        },
      };

      return {
        ...state,
        filters,
        filteredAssets: filterNewAssets(state.allAssets, filters),
      };
    }

    default:
      throw new Error("Unknown action type");
  }
};

// Create new context
const NewFiltersStateContext = createContext<{
  state: NewState;
  dispatch: Dispatch<NewAction>;
}>({ state: newInitialState, dispatch: () => undefined });

// Create a new provider component
const NewFiltersStateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(newReducer, newInitialState);

  return (
    <NewFiltersStateContext.Provider value={{ state, dispatch }}>
      {children}
    </NewFiltersStateContext.Provider>
  );
};

export { NewFiltersStateProvider, NewFiltersStateContext };
