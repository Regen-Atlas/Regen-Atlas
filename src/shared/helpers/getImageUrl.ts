import { Asset } from "../../modules/assets";
import { getIpfsLink } from "./getIpfsLink";

export const getImageUrl = (asset: Asset): string => {
  if (asset.imageUrl) {
    return asset.imageUrl;
  }

  return getIpfsLink(asset.imageHash);
};
