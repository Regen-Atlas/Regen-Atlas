import { Asset } from "../../modules/assets";
import { NewFilters } from "../../modules/filters";

export const filterNewAssets = (
  assets: Asset[],
  filters: NewFilters
): Asset[] => {
  const {
    provider: filterProvider,
    assetTypes: filterAssetTypes,
    platform: filterPlatform,
  } = filters;

  return assets.filter((asset) => {
    const providerId = asset.issuer.id;
    const assetTypeId = asset.asset_types[0].id;
    const platforms = asset.platforms;
    const assetSubtypeId = asset.asset_subtypes[0].id;

    if (filterProvider && providerId !== filterProvider) {
      return false;
    }

    if (
      filterPlatform &&
      !platforms.map((platform) => platform.id).includes(filterPlatform)
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
