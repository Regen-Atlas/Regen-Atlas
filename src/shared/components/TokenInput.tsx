import { Token } from "@uniswap/sdk-core";
import clsx from "clsx";
import { NumberInput } from "./NumberInput";
import { Logo42220 } from "../../modules/chains/logos/Logo42220";

interface TokenInputProps {
  type?: "buy" | "sell" | "retire";
  value: string;
  placeholder: string;
  token: Token;
  formattedBalance: string;
  displayBalance: boolean;
  onChange: (value: string) => void;
}

export const TokenInput: React.FC<TokenInputProps> = ({
  type,
  value,
  placeholder,
  token,
  formattedBalance,
  displayBalance,
  onChange,
}) => {
  const symbol = token.symbol?.toUpperCase();

  if (!symbol) {
    return <div>Invalid token</div>;
  }

  const tokenLogo = `${symbol}.${["PLASTIK", "CUSD"].includes(symbol) ? "png" : "svg"}`;

  return (
    <div className="grid p-4 rounded-lg border-2 border-gray-400 bg-cardBackground">
      {type && <span className="text-sm capitalize">{type}</span>}
      <div className="flex justify-between">
        <NumberInput
          className="py-2 border-none outline-none bg-transparent text-3xl w-full"
          value={value}
          placeholder={placeholder}
          onChange={onChange}
        />

        <div className="flex-shrink-0">
          <div className="flex gap-2 items-center">
            <div className="relative">
              <img
                src={`/tokens/${tokenLogo}`}
                alt={token.symbol}
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
            <span className="text-xl font-bold uppercase">{token.symbol}</span>
          </div>
          {displayBalance && (
            <div className="text-xs text-right mt-1">
              Balance: {formattedBalance}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
