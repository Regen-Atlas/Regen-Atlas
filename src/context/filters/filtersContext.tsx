import React, { createContext, useReducer, ReactNode, Dispatch } from "react";
import { filterNewAssets } from "./filterAssets";
import { NewAssetTypeFilters, NewFilters } from "../../modules/filters";
import { NewAsset } from "../../shared/types";

interface NewState {
  filters: NewFilters;
  filteredAssets: NewAsset[];
  allAssets: NewAsset[];
  selectedAssetId: string;
}

type ResetFiltersAction = { type: "RESET_FILTERS" };
type SetFilterAction = {
  type: "SET_FILTER";
  payload: { key: "provider" | "chainId"; value: string | number };
};

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

type ResetChainFilterAction = {
  type: "RESET_CHAIN_FILTER";
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

type NewSetChainIdFilter = {
  type: "SET_CHAIN_ID_FILTER";
  payload: string;
};

type RemoveChainIdFilter = {
  type: "REMOVE_CHAIN_ID_FILTER";
};

type SetSelectedAssetAction = {
  type: "SET_SELECTED_ASSET";
  payload: string;
};

type SetAllAssetsAction = { type: "SET_ALL_ASSETS"; payload: NewAsset[] };

type NewAction =
  | ResetFiltersAction
  | SetFilterAction
  | NewSetTypeFilterAction
  | NewRemoveTypeFilterAction
  | NewSetSubtypeFilterAction
  | NewRemoveSubtypeFilterAction
  | NewSetProviderFilter
  | NewSetChainIdFilter
  | RemoveProviderFilter
  | RemoveChainIdFilter
  | SetSelectedAssetAction
  | SetAllAssetsAction
  | ResetTypeFiltersAction
  | ResetProviderFilterAction
  | ResetChainFilterAction;

const newInitialState: NewState = {
  filters: {
    assetTypes: {},
    provider: null,
    chainId: "",
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

    case "SET_CHAIN_ID_FILTER": {
      const filters = {
        ...state.filters,
        chainId: action.payload,
      };

      return {
        ...state,
        filters,
        filteredAssets: filterNewAssets(state.allAssets, filters),
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

    case "RESET_CHAIN_FILTER": {
      const filters = {
        ...state.filters,
        chainId: "",
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
