import { Token } from "@uniswap/sdk-core";

interface UniswapTokenInputProps {
  type: "buy" | "sell";
  value: string;
  placeholder: string;
  token: Token;
  onChange: (value: string) => void;
}

export const UniswapTokenInput: React.FC<UniswapTokenInputProps> = ({
  type,
  value,
  placeholder,
  token,
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

        <div className="uppercase flex gap-2 items-center flex-shrink-0">
          <img
            src={`/tokens/${token.symbol?.toUpperCase()}.svg`}
            alt={token.symbol}
            className="w-8 h-8"
          />
          <span className="text-xl font-bold">{token.symbol}</span>
        </div>
      </div>
    </div>
  );
};
