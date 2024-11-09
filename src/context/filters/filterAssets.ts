import { NewFilters } from "../../modules/filters";
import { NewAsset } from "../../shared/types";

export const filterNewAssets = (
  assets: NewAsset[],
  filters: NewFilters
): NewAsset[] => {
  const {
    provider: filterProvider,
    chainId: filterChainId,
    assetTypes: filterAssetTypes,
  } = filters;

  return assets.filter((asset) => {
    const providerId = asset.issuer.id;
    const assetTypeId = asset.asset_types[0].id;
    const chains = asset.chains;
    const assetSubtypeId = asset.asset_subtypes[0].id;

    if (filterProvider && providerId !== filterProvider) {
      return false;
    }

    if (
      filterChainId &&
      chains.find((chain) => chain.id === filterChainId) === undefined
    ) {
      return false;
    }

    if (filterAssetTypes) {
      if (filterAssetTypes[assetTypeId]) {
        if (filterAssetTypes[assetTypeId].subtypes.length > 0) {
          if (!filterAssetTypes[assetTypeId].subtypes.includes(assetSubtypeId))
            return false;
        }
      } else if (Object.keys(filterAssetTypes).length > 0) {
        return false;
      } else {
        return true;
      }
    }

    return true;
  });
};
