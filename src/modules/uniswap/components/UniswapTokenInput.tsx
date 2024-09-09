import { Token } from "@uniswap/sdk-core";

interface UniswapTokenInputProps {
  type: "buy" | "sell";
  value: string;
  placeholder: string;
  token: Token;
  formattedBalance: string;
  displayBalance: boolean;
  onChange: (value: string) => void;
}

export const UniswapTokenInput: React.FC<UniswapTokenInputProps> = ({
  type,
  value,
  placeholder,
  token,
  formattedBalance,
  displayBalance,
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    val = val.replace(/,/g, ".");

    const isValidInput = /^-?\d*\.?\d*$/.test(val);

    if (isValidInput) {
      onChange(val);
    }
  };

  return (
    <div className="grid p-4 rounded-lg border-2 border-white bg-cardBackground">
      <span className="text-sm capitalize">{type}</span>
      <div className="flex justify-between">
        <input
          type="text"
          placeholder={placeholder}
          className="py-2 border-none outline-none bg-transparent text-3xl w-full"
          onChange={handleChange}
          value={value}
        />

        <div className="flex-shrink-0">
          <div className="flex gap-2 items-center">
            <img
              src={`/tokens/${token.symbol?.toUpperCase()}.svg`}
              alt={token.symbol}
              className="w-8 h-8"
            />
            <span className="text-xl font-bold uppercase">{token.symbol}</span>
          </div>
          {displayBalance && (
            <div className="text-xs">Balance: {formattedBalance}</div>
          )}
        </div>
      </div>
    </div>
  );
};
