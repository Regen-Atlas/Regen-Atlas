import { Token } from "@uniswap/sdk-core";
import {
  writeContract,
  getChainId,
  waitForTransactionReceipt,
} from "@wagmi/core";
import { config } from "../../wagmi";
import { Address, parseUnits } from "viem";
import {
  CELO_SWAP_ROUTER_ADDRESS,
  MAINNET_SWAP_ROUTER_ADDRESS,
} from "../../modules/uniswap";
import { ABI_ERC20_TOKEN, ABI_CELO_ERC_20_TOKEN } from "../abi";

export const getTokenApproval = async (
  token: Token,
  amount: string
): Promise<void> => {
  let chainId = getChainId(config);
  // @TODO: Remove this when we have a proper chainId for localhost
  if (chainId === 31337) {
    chainId = 1;
  }

  // send transaction to token contract to approve the swap router to spend the token

  if (chainId === 42220) {
    console.log("Approving CELO token");
    try {
      const hash = await writeContract(config, {
        abi: ABI_CELO_ERC_20_TOKEN,
        address: token.address as Address,
        functionName: "approve",
        args: [CELO_SWAP_ROUTER_ADDRESS, parseUnits(amount, token.decimals)],
      });

      await waitForTransactionReceipt(config, { hash });
    } catch (e) {
      throw new Error(`Error approving token spending on CELO: ${e}`);
    }
    return;
  }

  console.log("Approving ERC20 token");

  try {
    const hash = await writeContract(config, {
      abi: ABI_ERC20_TOKEN,
      address: token.address as Address,
      functionName: "approve",
      args: [MAINNET_SWAP_ROUTER_ADDRESS, parseUnits(amount, token.decimals)],
    });
    await waitForTransactionReceipt(config, { hash });
  } catch (e) {
    throw new Error(`Error approving ERC20 token spending: ${e}`);
  }
};
