import { useState } from "react";
import { UniswapTokenInput } from "./UniswapTokenInput";
import { Percent, Token } from "@uniswap/sdk-core";
import { getQuoteSimulation } from "../../../shared/helpers/getQuoteSimulation";
import { FeeAmount, Route, SwapOptions } from "@uniswap/v3-sdk";
import { formatNumber, parseNumber } from "../../../shared/helpers";
import { UNISWAP_POOLS_MAP } from "../pools";
import { getPool } from "../../../shared/helpers/getPool";
import { getQuoteFromQuoter } from "../../../shared/helpers/getQuoteFromQuoter";
import { getTokenApproval } from "../../../shared/helpers/getTokenApproval";
import { useAccount } from "wagmi";
import { executeTrade } from "../../../shared/helpers/executeTrade";

interface UniswapTradingProps {
  tokenIn: Token;
  tokenOut: Token;
}

export const UniswapTrading: React.FC<UniswapTradingProps> = ({
  tokenIn,
  tokenOut,
}) => {
  const [amountIn, setAmountIn] = useState("");
  const [quoteAmount, setQuoteAmount] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const { address } = useAccount();

  const handleInputChange = async (value: string) => {
    setAmountIn(value);
    const quote = await getQuoteSimulation({
      amountIn: parseFloat(value),
      tokenIn,
      tokenOut,
      fee: FeeAmount.MEDIUM,
    });
    setQuoteAmount(formatNumber(quote, tokenOut.decimals));
  };

  const handleBuy = async () => {
    if (!amountIn || !address) {
      return;
    }
    console.log("Buy");

    const poolAddress =
      UNISWAP_POOLS_MAP[`${tokenIn.address}${tokenOut.address}`];

    let pool;
    try {
      pool = await getPool(poolAddress, tokenIn, tokenOut);
    } catch (e) {
      console.error(e);
      return;
    }

    const swapRoute = new Route([pool], tokenIn, tokenOut);

    let quoteAmount;
    try {
      quoteAmount = await getQuoteFromQuoter({
        swapRoute,
        amountIn: parseFloat(amountIn),
        tokenIn,
      });
    } catch (e) {
      console.error(e);
      return;
    }

    console.log(
      "quote",
      quoteAmount,
      formatNumber(quoteAmount, tokenOut.decimals)
    );

    try {
      await getTokenApproval(tokenIn, amountIn);
    } catch (e) {
      console.error(e);
      return;
    }

    const options: SwapOptions = {
      slippageTolerance: new Percent(100, 10000), // 50 bips, or 0.50%
      deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
      recipient: address,
      sqrtPriceLimitX96: 0,
    };

    console.log("options", options);

    const res = await executeTrade({
      options,
      tokenIn,
      tokenOut,
      amountIn: parseNumber(amountIn, tokenIn.decimals).toString(),
      recipient: address,
      quoteAmount,
      swapRoute,
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
        onChange={(value) => handleInputChange(value)}
      />
      <UniswapTokenInput
        type="buy"
        placeholder="0"
        token={tokenOut}
        value={quoteAmount}
        onChange={() => {}}
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
