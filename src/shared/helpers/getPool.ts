import { FeeAmount, Pool } from "@uniswap/v3-sdk";
import { readContracts } from "@wagmi/core";
import { ABI_IUniswapV3Pool } from "../../modules/uniswap/ABI_IUniswapV3Pool";
import { config } from "../../wagmi";
import { Address } from "viem";
import { Token } from "@uniswap/sdk-core";

export const getPool = async (
  poolAddress: Address,
  tokenIn: Token,
  tokenOut: Token
): Promise<Pool> => {
  const poolContract = {
    abi: ABI_IUniswapV3Pool,
    address: poolAddress,
  };

  const result = await readContracts(config, {
    contracts: [
      {
        ...poolContract,
        functionName: "fee",
      },
      {
        ...poolContract,
        functionName: "liquidity",
      },
      {
        ...poolContract,
        functionName: "slot0",
      },
    ],
  });

  console.log("result", result);

  if (result[0].error || result[1].error || result[2].error) {
    throw new Error("Error fetching pool data");
  }

  const fee = result[0].result;
  const liquidity = result[1].result;
  const slot0 = result[2].result;

  const sqrtPriceX96 = slot0[0];
  const tick = slot0[1];

  const pool = new Pool(
    tokenIn,
    tokenOut,
    FeeAmount.MEDIUM,
    sqrtPriceX96.toString(),
    liquidity.toString(),
    tick
  );

  return pool;
};
