import clsx from "clsx";
import { Logo42220 } from "../../modules/chains/logos/Logo42220";
import { CaretDown } from "@phosphor-icons/react";
import { CELO_CELO_TOKEN } from "../consts";
import { CELO_CUSD_TOKEN } from "../../modules/uniswap";
import { Token } from "../types";

interface TokenSelectProps {
  selectedToken: Token;
  onTokenChange: (token: Token) => void;
}

const tokens = [CELO_CELO_TOKEN as Token, CELO_CUSD_TOKEN as Token];

// Currently only supports CELO chain
export const TokenSelect: React.FC<TokenSelectProps> = ({
  selectedToken,
  onTokenChange,
}) => {
  const handleTokenSelect = (token: Token) => {
    console.log("Selected token", token);
    const elem: any = document.activeElement;
    if (elem) {
      elem?.blur();
    }
    onTokenChange(token);
  };

  const tokenLogo = `${selectedToken.symbol.toUpperCase()}.${["PLASTIK", "CUSD"].includes(selectedToken.symbol.toUpperCase()) ? "png" : "svg"}`;

  return (
    <div className="dropdown">
      <div
        tabIndex={0}
        role="button"
        className="bg-slate-200 p-1 rounded-full flex gap-2 items-center mb-1 border-[1px] border-slate-400"
      >
        <div className="relative">
          <img
            src={`/tokens/${tokenLogo}`}
            alt={selectedToken?.symbol}
            className="w-8 h-8"
          />
          <div
            className={clsx(
              "absolute bottom-0 right-0",
              "border-[1px] border-cardBackground",
              "w-[14px] h-[14px] flex items-center justify-center rounded-sm"
            )}
            style={{
              backgroundColor: "#FCFF52",
            }}
          >
            <Logo42220 size={8} />
          </div>
        </div>
        <span className="text-lg font-bold">{selectedToken?.symbol}</span>
        <CaretDown size={20} weight="bold" />
      </div>
      <div
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
      >
        {tokens.map((token) => {
          return (
            <div
              key={token.symbol}
              className="flex gap-2 items-center cursor-pointer hover:bg-slate-200 mb-1 p-1 rounded"
              onClick={() => handleTokenSelect(token)}
            >
              <div className="relative">
                <img
                  src={`/tokens/${token.symbol.toUpperCase()}.${["PLASTIK", "CUSD"].includes(token.symbol.toUpperCase()) ? "png" : "svg"}`}
                  alt={token?.symbol}
                  className="w-8 h-8"
                />
                <div
                  className={clsx(
                    "absolute bottom-0 right-0",
                    "border-[1px] border-cardBackground",
                    "w-[14px] h-[14px] flex items-center justify-center rounded-sm"
                  )}
                  style={{
                    backgroundColor: "#FCFF52",
                  }}
                >
                  <Logo42220 size={8} />
                </div>
              </div>
              <span className="text-lg font-bold">{token?.symbol}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
