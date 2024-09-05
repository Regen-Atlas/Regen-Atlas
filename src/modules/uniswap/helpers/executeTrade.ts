import { ChainId, Token } from "@uniswap/sdk-core";
import { Route, SwapOptions, SwapRouter } from "@uniswap/v3-sdk";
import {
  sendTransaction,
  simulateContract,
  writeContract,
  getChainId,
} from "@wagmi/core";
import { config } from "../../../wagmi";
import {
  CELO_SWAP_ROUTER_ADDRESS,
  MAINNET_SWAP_ROUTER_ADDRESS,
  ABI_CELO_ROUTER,
} from "../.";
import { Address } from "viem";
import { getUncheckedTrade } from "./getUncheckedTrade";

export async function executeTrade({
  options,
  tokenIn,
  tokenOut,
  amountIn,
  recipient,
  quoteAmount,
  swapRoute,
}: {
  options: SwapOptions;
  tokenIn: Token;
  tokenOut: Token;
  amountIn: string;
  recipient: Address;
  quoteAmount: bigint;
  swapRoute: Route<Token, Token>;
}): Promise<Address> {
  const chainId = getChainId(config);

  if (chainId === ChainId.CELO) {
    try {
      const result = await simulateContract(config, {
        abi: ABI_CELO_ROUTER,
        address: CELO_SWAP_ROUTER_ADDRESS,
        functionName: "exactInputSingle",
        args: [
          {
            tokenIn: tokenIn.address as Address,
            tokenOut: tokenOut.address as Address,
            fee: 3000,
            recipient,
            deadline: Math.floor(Date.now() / 1000) + 60 * 20,
            amountIn: BigInt(amountIn),
            amountOutMinimum: BigInt(0),
            sqrtPriceLimitX96: BigInt(0),
          },
        ],
      });
      console.log("result", result);
      const hash = await writeContract(config, result.request);
      console.log("hash", hash);

      return hash;
    } catch (e) {
      throw new Error(`Failed to execute trade: ${e}`);
    }
  }

  let trade;
  try {
    trade = getUncheckedTrade({
      swapRoute,
      tokenIn,
      tokenOut,
      amountIn,
      quoteAmount,
    });
  } catch (e) {
    console.error(e);
    throw new Error(`Failed to get trade: ${e}`);
  }

  const methodParameters = SwapRouter.swapCallParameters([trade], options);

  console.log("methodParameters", methodParameters);

  const res = await sendTransaction(config, {
    to: MAINNET_SWAP_ROUTER_ADDRESS,
    data: methodParameters.calldata as Address,
  });

  console.log("res", res);

  return res;
}
