import { useState } from "react";
import { UniswapTokenInput } from "./UniswapTokenInput";
import { Percent, Token } from "@uniswap/sdk-core";
import { Route, SwapOptions } from "@uniswap/v3-sdk";
import { formatNumber, parseNumber } from "../../../shared/helpers";
import { useAccount } from "wagmi";
import {
  getQuoteSimulation,
  executeTrade,
  getPool,
  getTokenApproval,
  UNISWAP_POOLS_MAP,
} from "../.";
import { increaseByPercent } from "../../../shared/helpers/percent";
import { parseUnits } from "viem";

interface UniswapTradingProps {
  tokenIn: Token;
  tokenOut: Token;
}

export const UniswapTrading: React.FC<UniswapTradingProps> = ({
  tokenIn,
  tokenOut,
}) => {
  const [amountIn, setAmountIn] = useState("");
  const [amountOut, setAmountOut] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [tradeType, setTradeType] = useState<"exactInput" | "exactOutput">(
    "exactInput"
  );
  const { address } = useAccount();

  const { address: poolAddress, fee: poolFee } =
    UNISWAP_POOLS_MAP[`${tokenIn.address}${tokenOut.address}`];

  const handleAmountInChange = async (value: string) => {
    setAmountIn(value);
    const amount = parseFloat(value);

    if (isNaN(amount) || amount === 0) {
      setAmountOut("");
      return;
    }

    const quote = await getQuoteSimulation({
      type: "exactIn",
      amount,
      tokenIn,
      tokenOut,
      fee: poolFee,
    });

    setTradeType("exactInput");
    setAmountOut(formatNumber(quote, tokenOut.decimals));
  };

  const handleAmountOutChange = async (value: string) => {
    setAmountOut(value);
    const amount = parseFloat(value);

    if (isNaN(amount) || amount === 0) {
      setAmountIn("");
      return;
    }

    const quote = await getQuoteSimulation({
      type: "exactOut",
      amount: amount,
      tokenIn,
      tokenOut,
      fee: poolFee,
    });

    setTradeType("exactOutput");
    setAmountIn(formatNumber(quote, tokenIn.decimals));
  };

  const handleBuy = async () => {
    if (!amountIn || !address) {
      return;
    }

    const options: SwapOptions = {
      slippageTolerance: new Percent(50, 10000), // 50 bips, or 0.50%
      deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
      recipient: address,
      sqrtPriceLimitX96: 0,
    };

    let pool;
    try {
      pool = await getPool(poolAddress, tokenIn, tokenOut);
    } catch (e) {
      console.error(e);
      return;
    }

    const swapRoute = new Route([pool], tokenIn, tokenOut);

    // let quoteAmount;
    // try {
    //   if (tradeType === "exactInput") {
    //     quoteAmount = await getQuoteFromQuoter({
    //       swapRoute,
    //       amount: amountIn,
    //       token: tokenIn,
    //       tradeType: TradeType.EXACT_INPUT,
    //     });
    //   } else {
    //     quoteAmount = await getQuoteFromQuoter({
    //       swapRoute,
    //       amount: amountOut,
    //       token: tokenOut,
    //       tradeType: TradeType.EXACT_OUTPUT,
    //     });
    //   }
    // } catch (e) {
    //   console.error(e);
    //   return;
    // }

    const amountInWithDecimals = parseUnits(
      amountIn.toString(),
      tokenIn.decimals
    );
    try {
      const approvalAmount: bigint =
        tradeType === "exactInput"
          ? amountInWithDecimals
          : increaseByPercent(amountInWithDecimals, options.slippageTolerance);

      await getTokenApproval(tokenIn, approvalAmount);
    } catch (e) {
      console.error(e);
      return;
    }

    const res = await executeTrade({
      options,
      tokenIn,
      tokenOut,
      amountIn: amountInWithDecimals,
      amountOut: parseNumber(amountOut, tokenOut.decimals),
      recipient: address,
      swapRoute,
      type: tradeType,
    });

    if (res) {
      setTransactionHash(res);
    }
  };

  return (
    <div>
      <UniswapTokenInput
        type="sell"
        placeholder="0"
        token={tokenIn}
        value={amountIn}
        onChange={(value) => handleAmountInChange(value)}
      />
      <UniswapTokenInput
        type="buy"
        placeholder="0"
        token={tokenOut}
        value={amountOut}
        onChange={(value) => handleAmountOutChange(value)}
      />
      <button className="button" onClick={handleBuy}>
        BUY
      </button>
      {transactionHash && (
        <a href={`https://celoscan.io/tx/${transactionHash}`} target="_blank">
          Transaction: {transactionHash}
        </a>
      )}
    </div>
  );
};
