import type { Token } from "@uniswap/sdk-core";
import type { FeeAmount } from "@uniswap/v3-sdk";
import { getChainId, getPublicClient, simulateContract } from "@wagmi/core";
import type { Address } from "viem";
import { ABI_CELO_QUOTER, ABI_EVM_QUOTER, CELO_QUOTER_CONTRACT_ADDRESS, MAINNET_QUOTER_CONTRACT_ADDRESS } from "../.";
import { config } from "../../../wagmi";

export const getQuoteSimulation = async ({
  type,
  amount,
  tokenIn,
  tokenOut,
  fee,
}: {
  type: "exactIn" | "exactOut";
  amount: bigint;
  tokenIn: Token;
  tokenOut: Token;
  fee: FeeAmount;
}): Promise<bigint> => {
  const chainId = getChainId(config);
  // @TODO this might not be the best way to get the client. Check when we hve multiple chains and wallet is not connected
  const publicClient = getPublicClient(config);

  if (!publicClient) {
    throw new Error("Failed to get client");
  }

  if (chainId === 42220) {
    let response;
    if (type === "exactOut") {
      response = await publicClient.simulateContract({
        abi: ABI_CELO_QUOTER,
        address: CELO_QUOTER_CONTRACT_ADDRESS,
        functionName: "quoteExactOutputSingle",
        args: [
          {
            tokenIn: tokenIn.address as Address,
            tokenOut: tokenOut.address as Address,
            amount,
            fee,
            sqrtPriceLimitX96: BigInt("0"),
          },
        ],
      });
    } else {
      response = await publicClient.simulateContract({
        abi: ABI_CELO_QUOTER,
        address: CELO_QUOTER_CONTRACT_ADDRESS,
        functionName: "quoteExactInputSingle",
        args: [
          {
            tokenIn: tokenIn.address as Address,
            tokenOut: tokenOut.address as Address,
            amountIn: amount,
            fee,
            sqrtPriceLimitX96: BigInt("0"),
          },
        ],
      });
    }

    if (!response.result || !response.result[0]) {
      throw new Error("Failed to get quote amount");
    }

    console.log("quoteAmountSimulation", response.result[0]);

    return response.result[0];
  }

  // @TODO handle EVM quoter output

  const response = await simulateContract(config, {
    abi: ABI_EVM_QUOTER,
    address: MAINNET_QUOTER_CONTRACT_ADDRESS,
    functionName: "quoteExactInputSingle",
    args: [tokenIn.address as Address, tokenOut.address as Address, fee, amount, BigInt(0)],
  });

  if (!response.result) {
    throw new Error("Failed to get quote amount");
  }

  return response.result;
};
