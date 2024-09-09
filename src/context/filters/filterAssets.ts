import { Asset } from "../../modules/assets";
import { Filters } from "../../modules/filters";

export const filterAssets = (assets: Asset[], filters: Filters): Asset[] => {
  const {
    provider: filterProvider,
    chainId: filterChainId,
    assetTypes: filterAssetTypes,
  } = filters;

  return assets.filter((asset) => {
    const { providerId, tokens, assetTypeId, assetSubtypeId } = asset;

    if (filterProvider && providerId !== filterProvider) {
      return false;
    }

    if (
      filterChainId &&
      tokens?.every((token) => token.chainId !== filterChainId)
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
