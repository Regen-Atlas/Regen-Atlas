import type { Token } from "@uniswap/sdk-core";
import { getChainId, writeContract } from "@wagmi/core";
import type { Address, Hash } from "viem";
import { CELO_SWAP_ROUTER_ADDRESS, MAINNET_SWAP_ROUTER_ADDRESS } from "..";
import { ABI_CELO_ERC_20_TOKEN, ABI_ERC20_TOKEN } from "../../../shared/abi";
import { config } from "../../../wagmi";

export const getTokenApproval = async (
  token: Token,
  amountWithDecimals: bigint, // This is amount with decimals
): Promise<Hash> => {
  let chainId = getChainId(config);
  // @TODO: Remove this when we have a proper chainId for localhost
  if (chainId === 31337) {
    chainId = 1;
  }

  // send transaction to token contract to approve the swap router to spend the token

  if (chainId === 42220) {
    try {
      const hash = await writeContract(config, {
        abi: ABI_CELO_ERC_20_TOKEN,
        address: token.address as Address,
        functionName: "approve",
        args: [CELO_SWAP_ROUTER_ADDRESS, amountWithDecimals],
      });

      return hash;
    } catch (e) {
      throw new Error(`Error approving token spending on CELO: ${e}`);
    }
  }

  try {
    const hash = await writeContract(config, {
      abi: ABI_ERC20_TOKEN,
      address: token.address as Address,
      functionName: "approve",
      args: [MAINNET_SWAP_ROUTER_ADDRESS, amountWithDecimals],
    });
    return hash;
  } catch (e) {
    throw new Error(`Error approving ERC20 token spending: ${e}`);
  }
};
