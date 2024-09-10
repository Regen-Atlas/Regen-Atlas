import { CHAIN_MAPPING } from "../consts";

export const getChain = (chainId: number | string) => {
  return CHAIN_MAPPING[chainId];
};
