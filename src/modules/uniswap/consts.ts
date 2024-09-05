import { ChainId, Token } from "@uniswap/sdk-core";
import { IPoolFactoryMap } from "./types";
import {
  CELO_CHAR_TOKEN_ADDRESS,
  CELO_USDC_TOKEN_ADDRESS,
  MAINNET_UNI_TOKEN_ADDRESS,
  MAINNET_USDC_TOKEN_ADDRESS,
} from "./tokens";
import { Address } from "viem";

// Addresses

export const POOL_FACTORY_CONTRACT_ADDRESS =
  "0x1F98431c8aD98523631AE4a59f267346ea31F984";

export const CELO_POOL_FACTORY_CONTRACT_ADDRESS =
  "0xAfE208a311B21f13EF87E33A90049fC17A7acDEc";

export const POOL_FACTORY_CONTRACTS_MAP: IPoolFactoryMap = {
  [ChainId.MAINNET]: POOL_FACTORY_CONTRACT_ADDRESS,
  [ChainId.CELO]: CELO_POOL_FACTORY_CONTRACT_ADDRESS,
};

export const MAINNET_QUOTER_CONTRACT_ADDRESS =
  "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6";

export const CELO_QUOTER_CONTRACT_ADDRESS =
  "0x82825d0554fA07f7FC52Ab63c961F330fdEFa8E8";

export const QUOTER_CONTRACTS_MAP: { [key: number]: Address } = {
  [ChainId.MAINNET]: MAINNET_QUOTER_CONTRACT_ADDRESS,
  [ChainId.CELO]: CELO_QUOTER_CONTRACT_ADDRESS,
};

export const CELO_SWAP_ROUTER_ADDRESS =
  "0x5615CDAb10dc425a742d643d949a7F474C01abc4";

export const MAINNET_SWAP_ROUTER_ADDRESS =
  "0xE592427A0AEce92De3Edee1F18E0157C05861564";

// Currencies and Tokens

export const DAI_TOKEN = new Token(
  ChainId.MAINNET,
  "0x6b175474e89094c44da98b954eedeac495271d0f",
  18,
  "DAI",
  "Dai"
);

export const MAINNET_USDC_TOKEN = new Token(
  ChainId.MAINNET,
  MAINNET_USDC_TOKEN_ADDRESS,
  6,
  "USDC",
  "USD//C"
);

export const MAINNET_UNI_TOKEN = new Token(
  ChainId.MAINNET,
  MAINNET_UNI_TOKEN_ADDRESS,
  18,
  "UNI",
  "Uniswap"
);

export const CELO_USDC_TOKEN = new Token(
  ChainId.CELO,
  CELO_USDC_TOKEN_ADDRESS,
  6,
  "USDC",
  "USDC"
);

export const CELO_CHAR_TOKEN = new Token(
  ChainId.CELO,
  CELO_CHAR_TOKEN_ADDRESS,
  18,
  "CHAR",
  "Biochar"
);
