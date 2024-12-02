import { Address } from "viem";
import { TokenInput } from "../../shared/components/TokenInput";
import { CELO_CUSD_TOKEN } from "../uniswap";
import { useEffect, useState } from "react";
import { useTokenBalance } from "../uniswap/hooks/useFormattedBalance";
import { useAccount, useAccountEffect } from "wagmi";
import { parseNumber } from "../../shared/helpers";
import { NumberInput } from "../../shared/components/NumberInput";

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

export const Retirement: React.FC<RetirementProps> = ({
  retirementWallet,
  retirementChainId,
}) => {
  const [project, setProject] = useState<any>();
  const [creditsAmount, setCreditsAmount] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const { address } = useAccount();
  const tokenInBalance = useTokenBalance({
    token: CELO_CUSD_TOKEN,
    account: address,
  });
  const [status, setStatus] = useState<RetirementState>(
    !address ? "connect_wallet" : "enter_amount"
  );

  useEffect(() => {
    const fetchTokenBalance = async () => {
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

    fetchTokenBalance();
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

  const amountChangeSideeffect = (value: string) => {
    const amount = parseFloat(value);

    if (isNaN(amount) || amount === 0) {
      setStatus("enter_amount");
      return;
    }

    const formattedAmount = parseNumber(value, CELO_CUSD_TOKEN.decimals);

    if (address) {
      if (tokenInBalance.value < formattedAmount) {
        setStatus("insufficient_balance");
      } else {
        setStatus("ready");
      }
    }
  };

  const handleButtonClick = () => {};

  const onCreditsChange = (value: string) => {
    setCreditsAmount(value);
    const amount = `${(parseFloat(value) * project?.priceInCelo).toFixed(3)}`;
    if (value === "") {
      setTokenAmount("");
    } else {
      setTokenAmount(amount);
    }
    amountChangeSideeffect(amount);
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
          token={CELO_CUSD_TOKEN}
          value={tokenAmount}
          formattedBalance={tokenInBalance.formattedBalance}
          displayBalance={!!address}
          onChange={(value) => handleAmountChange(value)}
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
      </div>
    </>
  );
};
