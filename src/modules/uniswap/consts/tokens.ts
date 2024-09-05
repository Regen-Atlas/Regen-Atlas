import { ChainId, Token } from "@uniswap/sdk-core";

// Token Addresses
export const CELO_USDC_TOKEN_ADDRESS =
  "0xcebA9300f2b948710d2653dD7B07f33A8B32118C";
export const CELO_CHAR_TOKEN_ADDRESS =
  "0x50E85c754929840B58614F48e29C64BC78C58345";
export const MAINNET_USDC_TOKEN_ADDRESS =
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
export const MAINNET_UNI_TOKEN_ADDRESS =
  "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";

// Token Instances
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
