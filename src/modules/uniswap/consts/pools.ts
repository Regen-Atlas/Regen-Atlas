import { Address } from "viem";
import {
  CELO_CHAR_TOKEN_ADDRESS,
  CELO_USDC_TOKEN_ADDRESS,
  MAINNET_UNI_TOKEN_ADDRESS,
  MAINNET_USDC_TOKEN_ADDRESS,
} from "./tokens";
import { FeeAmount } from "@uniswap/v3-sdk";
import { IPoolFactoryMap, IUniswapPoolsMap } from "../types";
import { ChainId } from "@uniswap/sdk-core";

export const CELO_CHAR_USDC_POOL_ADDRESS: Address =
  "0x7f7C4335cCac291DDEdcEf4429A626C442b627ed";

export const ETHEREUM_USDC_UNI_POOL_ADDRESS: Address =
  "0xD0fC8bA7E267f2bc56044A7715A489d851dC6D78";

export const UNISWAP_POOLS_MAP: IUniswapPoolsMap = {
  [`${CELO_USDC_TOKEN_ADDRESS}${CELO_CHAR_TOKEN_ADDRESS}`]: {
    address: CELO_CHAR_USDC_POOL_ADDRESS,
    fee: FeeAmount.MEDIUM,
  },
  [`${MAINNET_USDC_TOKEN_ADDRESS}${MAINNET_UNI_TOKEN_ADDRESS}`]: {
    address: ETHEREUM_USDC_UNI_POOL_ADDRESS,
    fee: FeeAmount.MEDIUM,
  },
};

export const POOL_FACTORY_CONTRACT_ADDRESS =
  "0x1F98431c8aD98523631AE4a59f267346ea31F984";

export const CELO_POOL_FACTORY_CONTRACT_ADDRESS =
  "0xAfE208a311B21f13EF87E33A90049fC17A7acDEc";

export const POOL_FACTORY_CONTRACTS_MAP: IPoolFactoryMap = {
  [ChainId.MAINNET]: POOL_FACTORY_CONTRACT_ADDRESS,
  [ChainId.CELO]: CELO_POOL_FACTORY_CONTRACT_ADDRESS,
};
