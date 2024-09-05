import { Token } from "@uniswap/sdk-core";

export interface ExampleConfig {
  rpc: {
    local: string;
    mainnet: string;
  };
  tokens: {
    in: Token;
    amountIn: number;
    out: Token;
    poolFee: number;
  };
}

export interface IPoolFactoryMap {
  [key: number]: string;
}
