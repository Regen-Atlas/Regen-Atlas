import { Token } from "@uniswap/sdk-core";
import { simulateContract, getChainId } from "@wagmi/core";
import { config } from "../../wagmi";
import { parseNumber } from "./decimals";
import {
  CELO_QUOTER_CONTRACT_ADDRESS,
  MAINNET_QUOTER_CONTRACT_ADDRESS,
} from "../../modules/uniswap";
import { FeeAmount } from "@uniswap/v3-sdk";
import { Address } from "viem";
import { ABI_CELO_QUOTER, ABI_EVM_QUOTER } from "../../modules/uniswap/abi";

export const getQuoteSimulation = async ({
  amountIn,
  tokenIn,
  tokenOut,
  fee,
}: {
  amountIn: number;
  tokenIn: Token;
  tokenOut: Token;
  fee: FeeAmount;
}): Promise<bigint> => {
  const chainId = getChainId(config);
  const formattedAmountIn = parseNumber(amountIn.toString(), tokenIn.decimals);

  if (chainId === 42220) {
    const response = await simulateContract(config, {
      abi: ABI_CELO_QUOTER,
      address: CELO_QUOTER_CONTRACT_ADDRESS,
      functionName: "quoteExactInputSingle",
      args: [
        {
          tokenIn: tokenIn.address as Address,
          tokenOut: tokenOut.address as Address,
          amountIn: formattedAmountIn,
          fee,
          sqrtPriceLimitX96: BigInt("0"),
        },
      ],
    });

    console.log("response", response);

    if (!response.result || !response.result[0]) {
      throw new Error("Failed to get quote amount");
    }

    return response.result[0];
  }

  const response = await simulateContract(config, {
    abi: ABI_EVM_QUOTER,
    address: MAINNET_QUOTER_CONTRACT_ADDRESS,
    functionName: "quoteExactInputSingle",
    args: [
      tokenIn.address as Address,
      tokenOut.address as Address,
      fee,
      formattedAmountIn,
      BigInt(0),
    ],
  });

  console.log("response evm", response);

  if (!response.result) {
    throw new Error("Failed to get quote amount");
  }

  return response.result;
};
