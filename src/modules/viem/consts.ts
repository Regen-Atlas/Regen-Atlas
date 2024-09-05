import { celo, mainnet } from "viem/chains";
import { IChainRpcUrls } from "./types";
export const CHAIN_RPC_URLS: IChainRpcUrls = {
  [mainnet.id]: "https://rpc-mainnet.maticvigil.com",
  [celo.id]: "https://forno.celo.org",
};
