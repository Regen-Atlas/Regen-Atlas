import React, { createContext, useReducer, ReactNode, Dispatch } from "react";
import { AssetTypeFilters, Filters } from "../../shared/types/filters";
import { Asset } from "../../shared/types";
import { filterAssets } from "./filterAssets";
import { ALL_ASSETS } from "../../data";

interface State {
  filters: Filters;
  filteredAssets: Asset[];
  selectedAssetId: string;
}

type SetAllFiltersAction = { type: "SET_FILTERS"; payload: Filters };
type ResetFiltersAction = { type: "RESET_FILTERS" };
type SetFilterAction = {
  type: "SET_FILTER";
  payload: { key: "provider" | "chainId"; value: string | number };
};
type SetTypeFilterAction = {
  type: "SET_TYPE_FILTER";
  payload: AssetTypeFilters;
};
type RemoveTypeFilterAction = { type: "REMOVE_TYPE_FILTER"; payload: string };

type SetSubtypeFilterAction = {
  type: "SET_SUBTYPE_FILTER";
  payload: {
    typeId: string;
    subtypeId: string;
  };
};

type RemoveSubtypeFilterAction = {
  type: "REMOVE_SUBTYPE_FILTER";
  payload: {
    typeId: string;
    subtypeId: string;
  };
};

type SetProviderFilter = {
  type: "SET_PROVIDER_FILTER";
  payload: string;
};

type RemoveProviderFilter = {
  type: "REMOVE_PROVIDER_FILTER";
};

type SetChainIdFilter = {
  type: "SET_CHAIN_ID_FILTER";
  payload: number | string;
};

type RemoveChainIdFilter = {
  type: "REMOVE_CHAIN_ID_FILTER";
};

type SetSelectedAssetAction = {
  type: "SET_SELECTED_ASSET";
  payload: string;
};

type Action =
  | SetAllFiltersAction
  | ResetFiltersAction
  | SetFilterAction
  | SetTypeFilterAction
  | RemoveTypeFilterAction
  | SetSubtypeFilterAction
  | RemoveSubtypeFilterAction
  | SetProviderFilter
  | SetChainIdFilter
  | RemoveProviderFilter
  | RemoveChainIdFilter
  | SetSelectedAssetAction;

const initialState: State = {
  filters: {
    assetTypes: {},
    provider: "",
    chainId: "",
  },
  filteredAssets: [...ALL_ASSETS],
  selectedAssetId: "",
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_FILTERS":
      return { ...state, filters: action.payload };
    case "RESET_FILTERS":
      return initialState;
    case "SET_FILTER": {
      const filters = {
        ...state.filters,
        [action.payload.key]: action.payload.value,
      };

      return {
        ...state,
        filters,
        filteredAssets: filterAssets(ALL_ASSETS, filters),
      };
    }
    case "SET_TYPE_FILTER": {
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
        filteredAssets: filterAssets(ALL_ASSETS, filters),
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
        filteredAssets: filterAssets(ALL_ASSETS, filters),
      };
    }
    case "SET_SUBTYPE_FILTER": {
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
        filteredAssets: filterAssets(ALL_ASSETS, filters),
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
        filteredAssets: filterAssets(ALL_ASSETS, filters),
      };
    }

    case "SET_PROVIDER_FILTER": {
      const filters = {
        ...state.filters,
        provider: action.payload,
      };

      return {
        ...state,
        filters,
        filteredAssets: filterAssets(ALL_ASSETS, filters),
      };
    }

    case "REMOVE_PROVIDER_FILTER": {
      const filters = {
        ...state.filters,
        provider: "",
      };

      return {
        ...state,
        filters,
        filteredAssets: filterAssets(ALL_ASSETS, filters),
      };
    }

    case "SET_CHAIN_ID_FILTER": {
      const filters = {
        ...state.filters,
        chainId: action.payload,
      };

      return {
        ...state,
        filters,
        filteredAssets: filterAssets(ALL_ASSETS, filters),
      };
    }

    case "REMOVE_CHAIN_ID_FILTER": {
      const filters = {
        ...state.filters,
        chainId: "",
      };

      return {
        ...state,
        filters,
        filteredAssets: filterAssets(ALL_ASSETS, filters),
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

    default:
      throw new Error("Unknown action type");
  }
};

// Create context
const FiltersStateContext = createContext<{
  state: State;
  dispatch: Dispatch<Action>;
}>({ state: initialState, dispatch: () => undefined });

// Create a provider component
const FiltersStateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <FiltersStateContext.Provider value={{ state, dispatch }}>
      {children}
    </FiltersStateContext.Provider>
  );
};

export { FiltersStateProvider, FiltersStateContext };
