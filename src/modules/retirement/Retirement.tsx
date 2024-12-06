import { Address, parseEther } from "viem";
import { TokenInput } from "../../shared/components/TokenInput";
import { CELO_CUSD_TOKEN } from "../uniswap";
import { useEffect, useState } from "react";
import { useAccount, useAccountEffect } from "wagmi";
import { parseNumber } from "../../shared/helpers";
import { NumberInput } from "../../shared/components/NumberInput";
import { useWriteContract } from "wagmi";
import { ABI_CELO_ERC_20_TOKEN } from "../../shared/abi";
import { CELO_CELO_TOKEN } from "../../shared/consts";
import { Token } from "../../shared/types";
import { useTokensBalances } from "../../shared/hooks/useTokensBalances";

interface RetirementProps {
  retirementWallet: Address;
  retirementChainId: string;
}

type RetirementState =
  | "connect_wallet"
  | "enter_amount"
  | "insufficient_balance"
  | "ready"
  | "confirm_approve"
  | "awaiting_approval_confirmation"
  | "swap"
  | "done"
  | "error";

const buttonText: Record<RetirementState, string> = {
  connect_wallet: "Connect Wallet",
  enter_amount: "Enter an amount",
  insufficient_balance: "Insufficient Balance",
  ready: "Retire",
  confirm_approve: "Approve and swap",
  awaiting_approval_confirmation: "Awaiting confirmation",
  swap: "Swap",
  done: "Swap",
  error: "Confirm Swap",
};

export const Retirement: React.FC<RetirementProps> = ({ retirementWallet }) => {
  const [selectedToken, setSelectedToken] = useState<Token>(
    CELO_CELO_TOKEN as Token
  );
  const [project, setProject] = useState<any>();
  const [creditsAmount, setCreditsAmount] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const { address } = useAccount();

  const balances = useTokensBalances({
    tokens: [CELO_CELO_TOKEN as Token, CELO_CUSD_TOKEN as Token],
    account: address,
  });
  console.log("balances", balances);
  const [status, setStatus] = useState<RetirementState>(
    !address ? "connect_wallet" : "enter_amount"
  );
  const { data: transferHash, writeContract } = useWriteContract();

  useEffect(() => {
    const fetchCreditDetails = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_ECOTOKEN_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            celo_wallet: retirementWallet,
          }),
        });
        const data = await res.json();
        console.log("data", data);
        setProject(data);
      } catch (error) {
        console.log("Error fetching token details", error);
      }
    };

    fetchCreditDetails();
  }, []);

  useAccountEffect({
    onConnect: () => setStatus("enter_amount"),
    onDisconnect: () => setStatus("connect_wallet"),
  });

  if (!project) {
    return <div>Loading...</div>;
  }

  const handleAmountChange = (value: string) => {
    setTokenAmount(value);
    amountChangeSideeffect(value);

    const creditAmount = `${(parseFloat(value) / project.priceInCelo).toFixed(3)}`;
    if (value === "") {
      setCreditsAmount("");
    } else {
      setCreditsAmount(creditAmount);
    }
  };

  const amountChangeSideeffect = (value: string, updatedToken?: Token) => {
    const amount = parseFloat(value);

    if (isNaN(amount) || amount === 0) {
      setStatus("enter_amount");
      return;
    }

    const formattedAmount = parseNumber(value, CELO_CUSD_TOKEN.decimals);

    if (address) {
      if (
        balances[updatedToken ? updatedToken.address : selectedToken.address]
          .value < formattedAmount
      ) {
        setStatus("insufficient_balance");
      } else {
        setStatus("ready");
      }
    }
  };

  const handleButtonClick = () => {
    writeContract({
      abi: ABI_CELO_ERC_20_TOKEN,
      functionName: "transfer",
      args: [retirementWallet, parseEther("0.01")],
      address: selectedToken.address as Address,
    });
  };

  const onCreditsChange = (value: string) => {
    setCreditsAmount(value);

    let updatedTokenAmount;
    if (selectedToken.symbol === "CELO") {
      updatedTokenAmount = `${(parseFloat(value) * project.priceInCelo).toFixed(3)}`;
    } else {
      updatedTokenAmount = `${(parseFloat(value) * project.price).toFixed(3)}`;
    }
    if (value === "") {
      setTokenAmount("");
    } else {
      setTokenAmount(updatedTokenAmount);
    }
    amountChangeSideeffect(updatedTokenAmount);
  };

  const onTokenChange = (token: Token) => {
    setSelectedToken(token);
    // recalculating the amount
    let updatedTokenAmount;
    if (token.symbol === "CELO") {
      updatedTokenAmount = `${(parseFloat(creditsAmount) * project.priceInCelo).toFixed(3)}`;
    } else {
      updatedTokenAmount = `${(parseFloat(creditsAmount) * project.price).toFixed(3)}`;
    }

    if (updatedTokenAmount === "") {
      setTokenAmount("");
    } else {
      setTokenAmount(updatedTokenAmount);
    }
    amountChangeSideeffect(updatedTokenAmount, token);
  };

  return (
    <>
      <div className="card-shadow border-2 border-white p-3 rounded-[20px] bg-cardBackground">
        <h3 className="text-xl font-semibold my-2">
          Buy and retire (${project.price} per credit)
        </h3>
        <p className="text-sm mb-4">
          Lorem Ipsum change this to describe what user can expect to happen.
          Lorem Ipsum change this to describe what user can expect to happen.
          Lorem Ipsum change this to describe what user can expect to happen.
          Lorem Ipsum change this to describe what user can expect to happen.{" "}
        </p>
        <div className="mb-2 flex items-center justify-start p-4 rounded-lg border-2 border-gray-400 bg-cardBackground">
          <span className="text-2xl mr-4">Retire</span>
          <NumberInput
            className="py-2 border-none outline-none bg-transparent text-2xl w-20"
            value={creditsAmount}
            placeholder="0"
            onChange={onCreditsChange}
          />
          <span>Credit(s)</span>
        </div>
        <TokenInput
          placeholder="0"
          token={selectedToken}
          value={tokenAmount}
          formattedBalance={balances[selectedToken.address].formattedBalance}
          displayBalance={!!address}
          text="For:"
          onChange={(value) => handleAmountChange(value)}
          onTokenChange={(token) => onTokenChange(token)}
        />

        <button
          className="button button-gradient w-full my-2"
          onClick={handleButtonClick}
          disabled={
            status === "insufficient_balance" ||
            status === "enter_amount" ||
            status === "awaiting_approval_confirmation"
          }
        >
          {buttonText[status]}
        </button>
        {transferHash && (
          <div className="text-xs text-center mt-2">
            Transaction hash: {transferHash}
          </div>
        )}
      </div>
    </>
  );
};
