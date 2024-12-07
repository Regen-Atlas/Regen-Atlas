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
import { useModal } from "connectkit";
import { useWaitForTransactionReceipt } from "wagmi";
import { Modal } from "../../shared/components";

interface RetirementProps {
  retirementWallet: Address;
  retirementChainId: string;
}

type RetirementState =
  | "connect_wallet"
  | "enter_amount"
  | "insufficient_balance"
  | "minimum_not_met"
  | "ready"
  | "approving"
  | "done"
  | "error";

interface RetirementConfirmation {
  beneficiary: string;
  creditsRetired: string;
  description: string;
  isValid: boolean;
  protocolAddress: string;
  retirementHash: string;
  status: string;
  timeStamp: string;
  tokenAddress: string;
  usdValue: string;
  wallet: string;
}

const buttonText: Record<RetirementState, string> = {
  connect_wallet: "Connect Wallet",
  enter_amount: "Enter an amount",
  insufficient_balance: "Insufficient Balance",
  minimum_not_met: "Minimum ",
  approving: "approve in your wallet",
  ready: "Retire",
  done: "Swap",
  error: "Retire",
};

export const Retirement: React.FC<RetirementProps> = ({ retirementWallet }) => {
  const [minimumCredits, setMinimumCredits] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token>(
    CELO_CELO_TOKEN as Token
  );
  const [retirementAmount, setRetirementAmount] = useState("");
  const [project, setProject] = useState<any>();
  const [creditsAmount, setCreditsAmount] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const { address } = useAccount();
  const { setOpen: connectWallet } = useModal();
  const [retirementConfirmation, setRetirementConfirmation] =
    useState<RetirementConfirmation>();

  const balances = useTokensBalances({
    tokens: [CELO_CELO_TOKEN as Token, CELO_CUSD_TOKEN as Token],
    account: address,
  });
  const [status, setStatus] = useState<RetirementState>(
    !address ? "connect_wallet" : "enter_amount"
  );
  const { data: transferHash, writeContractAsync } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({
    hash: transferHash,
  });

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
        setProject(data);
        setMinimumCredits(2 / data.price);
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

    let updatedCreditsAmount;
    if (selectedToken.symbol === "CELO") {
      updatedCreditsAmount = `${(parseFloat(value) / project.priceInCelo).toFixed(3)}`;
    } else {
      updatedCreditsAmount = `${(parseFloat(value) / project.price).toFixed(3)}`;
    }

    if (value === "") {
      setCreditsAmount("");
    } else {
      setCreditsAmount(updatedCreditsAmount);
      if (parseFloat(updatedCreditsAmount) < minimumCredits) {
        setStatus("minimum_not_met");
      }
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

  const handleButtonClick = async () => {
    setStatus("approving");
    if (status === "connect_wallet") {
      connectWallet(true);
    } else if (status === "ready" || status === "error") {
      try {
        await writeContractAsync({
          abi: ABI_CELO_ERC_20_TOKEN,
          functionName: "transfer",
          args: [retirementWallet, parseEther(tokenAmount)],
          address: selectedToken.address as Address,
        });
        setRetirementAmount(`${tokenAmount} ${selectedToken.symbol}`);
        setStatus("done");
      } catch {
        setStatus("error");
      }
    }
  };

  const getTransactionConfirmation = async (hash: Address) => {
    try {
      const data = await fetch(import.meta.env.VITE_ECOTOKEN_CONFIRMATION, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tx: hash,
        }),
      });
      const res = await data.json();
      console.log("Transaction details", res);

      setRetirementConfirmation(res.validationResult);
      setShowModal(true);
    } catch {
      console.log("Error fetching transaction details");
    }
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
    if (parseFloat(value) < minimumCredits) {
      setStatus("minimum_not_met");
    }
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
        {status !== "done" && (
          <div>
            <p className="text-sm mb-4">
              Lorem Ipsum change this to describe what user can expect to
              happen. Lorem Ipsum change this to describe what user can expect
              to happen. Lorem Ipsum change this to describe what user can
              expect to happen. Lorem Ipsum change this to describe what user
              can expect to happen.{" "}
            </p>
            <div className="mb-2 p-4 rounded-lg border-2 border-gray-400 bg-cardBackground">
              <div className="flex items-center justify-start ">
                <div>
                  <span className="text-2xl mr-4">Retire</span>
                </div>
                <NumberInput
                  className="py-2 border-none outline-none bg-transparent text-2xl w-20"
                  value={creditsAmount}
                  placeholder="0"
                  onChange={onCreditsChange}
                />
                <span>Credit(s)</span>
              </div>
              <div className="text-xs font-medium">
                Minimum {minimumCredits} credit{minimumCredits === 1 ? "" : "s"}
              </div>
            </div>
            <TokenInput
              placeholder="0"
              token={selectedToken}
              value={tokenAmount}
              formattedBalance={
                balances[selectedToken.address].formattedBalance
              }
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
                status === "approving" ||
                status === "minimum_not_met"
              }
            >
              {buttonText[status]}
              {status === "minimum_not_met" &&
                `${minimumCredits} ${minimumCredits === 1 ? "credit" : "credits"} required`}
            </button>
          </div>
        )}
        {status === "done" && (
          <div>
            {!isSuccess && (
              <div className="h-40 flex items-center justify-center">
                <div>
                  <div>Processing credit retirement...</div>
                  <div className="flex justify-center">
                    <span className="loading loading-spinner loading-lg"></span>
                  </div>
                </div>
              </div>
            )}
            {isSuccess && (
              <div className="h-40 flex flex-col items-center justify-center text-center">
                <p>
                  You successfully retired{" "}
                  <span className="font-bold">{project.name}</span> credits
                  worth <span className="font-bold">{retirementAmount}</span>
                </p>
                <button
                  className="button button-gradient my-4"
                  onClick={() => {
                    if (transferHash) {
                      getTransactionConfirmation(
                        "0x5ef73bf47311c4f92416f874f00723c48e9a2ff9e500e0245e5f15937471bda6"
                      );
                    }
                  }}
                >
                  Get confirmation
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {showModal && (
        <Modal
          onClose={() => {
            if (status === "done") {
              setStatus("enter_amount");
            }
            setShowModal(false);
          }}
        >
          {retirementConfirmation?.status === "Delivered" && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Retirement Details</h3>
              <p className="my-2">
                You have successfully retired{" "}
                <span className="font-bold">{project.name}</span> worth{" "}
                {retirementAmount}
              </p>
              <div>
                This is the retirementHash, which serves as confirmation:
                <p className="font-bold my-2">
                  {retirementConfirmation?.retirementHash}
                </p>
                <a
                  className="block text-center button button-gradient mt-4"
                  href={`https://www.mintscan.io/regen/tx/${retirementConfirmation?.retirementHash}`}
                  target="_blank"
                >
                  Check on Mintscan
                </a>
              </div>
            </div>
          )}
          {retirementConfirmation?.status === "pooled" && (
            <div className="max-w-[90vw] w-[720px]">
              <h3 className="text-xl font-semibold mb-4">
                Credits are being pooled
              </h3>
              <div>
                They didn't reach the minimum $2 threshold. They will stay in
                the pool until it reaches the minimum threshold and then be
                retired. Take note of your transaction hash:
              </div>
              <div className="font-bold my-4 break-all">{transferHash}</div>
              <div>
                You can use it to check the status of the retirement on:
              </div>
              <a
                className="block text-center button button-gradient mt-4"
                href="https://scan.ecotoken.earth"
                target="_blank"
              >
                Ecotoken scan
              </a>
            </div>
          )}
          {!retirementConfirmation?.isValid && (
            <div className="max-w-[90vw] w-[720px]">
              <h3 className="text-xl font-semibold mb-4">
                Error retiring credits
              </h3>
              <div>
                Transaction was not processed correctly. Please refer to your
                wallet for more details. If the transaction went through you can
                use the transaction hash to check the status of the retirement
                on:
              </div>
              <div className="font-bold my-4 break-all">{transferHash}</div>
              <div>You can check the retirement on:</div>
              <a
                className="block text-center button button-gradient mt-4"
                href="https://scan.ecotoken.earth"
                target="_blank"
              >
                Ecotoken scan
              </a>
            </div>
          )}
        </Modal>
      )}
    </>
  );
};
