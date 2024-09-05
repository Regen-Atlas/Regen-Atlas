import {
  CurrencyAmount,
  QUOTER_ADDRESSES,
  Token,
  TradeType,
} from "@uniswap/sdk-core";
import { Route, SwapQuoter } from "@uniswap/v3-sdk";
import { Address, decodeAbiParameters, parseAbiParameters } from "viem";
import { call, getChainId } from "@wagmi/core";
import { config } from "../../../wagmi";
import { parseNumber } from "../../../shared/helpers/decimals";

export async function getQuoteFromQuoter({
  swapRoute,
  amountIn,
  tokenIn,
}: {
  swapRoute: Route<Token, Token>;
  amountIn: number;
  tokenIn: Token;
}): Promise<bigint> {
  let chainId = getChainId(config);
  // @TODO: Remove this when we have a proper chainId for localhost
  if (chainId === 31337) {
    chainId = 1;
  }
  const useQuoterV2 = chainId === 42220;
  const { calldata } = SwapQuoter.quoteCallParameters(
    swapRoute,
    CurrencyAmount.fromRawAmount(
      tokenIn,
      parseNumber(amountIn.toString(), tokenIn.decimals).toString()
    ),
    TradeType.EXACT_INPUT,
    {
      useQuoterV2,
    }
  );

  console.log("calldata", calldata);

  console.log("QUOTER_ADDRESSES[chainId]", QUOTER_ADDRESSES[chainId]);

  const quoteCallReturnData = await call(config, {
    to: QUOTER_ADDRESSES[chainId] as Address,
    data: calldata as Address,
  });

  console.log("quoteCallReturnData", quoteCallReturnData.data);

  if (!quoteCallReturnData.data) {
    throw new Error("No data returned from quote call");
  }

  const amount = decodeAbiParameters(
    parseAbiParameters("uint256"),
    quoteCallReturnData.data
  )[0];

  return amount;
}
