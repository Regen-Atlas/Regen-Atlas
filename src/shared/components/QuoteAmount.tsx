import { FeeAmount } from "@uniswap/v3-sdk";
import { useSimulateContract } from "wagmi";
import { CELO_QUOTER_CONTRACT_ADDRESS } from "../../modules/uniswap";
import { ABI_CELO_Quoter } from "../../modules/uniswap/ABI_Quoter";
import {
  CELO_CHAR_TOKEN_ADDRESS,
  CELO_USDC_TOKEN_ADDRESS,
} from "../../modules/uniswap/tokens";
import { formatNumber, parseNumber } from "../helpers";

export const QuoteAmount = ({
  amountIn,
}: {
  amountIn: number;
}): React.ReactElement => {
  const formattedAmountIn = parseNumber(amountIn.toString(), 6);

  console.log("formattedAmountIn", formattedAmountIn);

  if (!formattedAmountIn) {
    return <div>awaiting input...</div>;
  }

  const response = useSimulateContract({
    abi: ABI_CELO_Quoter,
    address: CELO_QUOTER_CONTRACT_ADDRESS,
    functionName: "quoteExactInputSingle",
    args: [
      {
        tokenIn: CELO_USDC_TOKEN_ADDRESS,
        tokenOut: CELO_CHAR_TOKEN_ADDRESS,
        amountIn: formattedAmountIn,
        fee: BigInt(FeeAmount.MEDIUM),
        sqrtPriceLimitX96: BigInt(0),
      },
    ],
  });

  console.log("response", response);

  if (!response.data) {
    return <div>Getting quote...</div>;
  }

  const quotedAmountOut = formatNumber(response?.data?.result[0], 18, 6);
  return <div>{quotedAmountOut}</div>;
};
