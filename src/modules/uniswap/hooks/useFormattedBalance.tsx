import { Address, parseUnits } from "viem";
import { useBalance } from "wagmi";
import { formatNumber } from "../../../shared/helpers";
import { Token } from "@uniswap/sdk-core";

interface TokenBalance {
  value: bigint;
  formattedBalance: string;
}

export function useTokenBalance({
  token,
  account,
}: {
  token: Token;
  account: Address | undefined;
}): TokenBalance {
  // @TODO useMemo
  const result = useBalance({
    address: account,
    token: token.address as Address,
  });

  if (!account) {
    return {
      value: parseUnits("0", token.decimals),
      formattedBalance: "0",
    };
  }

  if (result.error) {
    throw new Error("Token balance not found");
  }

  if (result.isLoading) {
    return {
      value: parseUnits("0", 18),
      formattedBalance: "0",
    };
  }

  if (!result.data) {
    throw new Error("Token balance data not found");
  }

  if (result.data.value < parseUnits("0.001", result.data.decimals)) {
    return {
      value: result.data.value,
      formattedBalance: "<0.001",
    };
  }

  return {
    value: result.data.value,
    formattedBalance: formatNumber(result.data.value, result.data.decimals, 3),
  };
}
