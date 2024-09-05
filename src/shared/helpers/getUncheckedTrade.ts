import { CurrencyAmount, Token, TradeType } from "@uniswap/sdk-core";
import { Route, Trade } from "@uniswap/v3-sdk";
import { parseNumber } from "./decimals";

export const getUncheckedTrade = ({
  swapRoute,
  tokenIn,
  tokenOut,
  amountIn,
  quoteAmount,
}: {
  swapRoute: Route<Token, Token>;
  tokenIn: Token;
  tokenOut: Token;
  amountIn: string;
  quoteAmount: bigint;
}) => {
  console.log("swapRoute", swapRoute);
  console.log("tokenIn", tokenIn);
  console.log("tokenOut", tokenOut);
  console.log("amountIn", amountIn);
  console.log("quoteAmount", quoteAmount);

  const uncheckedTrade = Trade.createUncheckedTrade({
    route: swapRoute,
    inputAmount: CurrencyAmount.fromRawAmount(tokenIn, amountIn),
    outputAmount: CurrencyAmount.fromRawAmount(
      tokenOut,
      quoteAmount.toString()
    ),
    tradeType: TradeType.EXACT_INPUT,
  });

  console.log("uncheckedTrade", uncheckedTrade);

  const amount1 = uncheckedTrade.swaps[0].inputAmount.numerator.toString();
  const amount2 = uncheckedTrade.swaps[0].outputAmount.numerator.toString();

  console.log("amount1", amount1);
  console.log("amount2", amount2);

  return uncheckedTrade;
};
