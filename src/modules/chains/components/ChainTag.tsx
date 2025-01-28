import { Logo1 } from "../logos/Logo1";
import { Logo137 } from "../logos/Logo137";
import { Logo397 } from "../logos/Logo397";
import { Logo42 } from "../logos/Logo42";
import { Logo42161 } from "../logos/Logo42161";
import { Logo42220 } from "../logos/Logo42220";
import { Logo56 } from "../logos/Logo56";
import { Logo8453 } from "../logos/Logo8453";
import { LogoAlgorandMainnet } from "../logos/LogoAlgorandMainnet";
import { LogoChainDefault } from "../logos/LogoChainDefault";
import { LogoRegen1 } from "../logos/LogoRegen1";
import { LogoSolanaMainnet } from "../logos/LogoSolanaMainnet";
import { ChainBranding } from "../types";

export const ChainTag = ({ chain }: { chain: ChainBranding }) => {
  const renderLogo = () => {
    switch (chain.id) {
      case "42220":
        return <Logo42220 />;
      case "42161":
        return <Logo42161 />;
      case "8453":
        return <Logo8453 />;
      case "397":
        return <Logo397 />;
      case "137":
        return <Logo137 />;
      case "56":
        return <Logo56 />;
      case "42":
        return <Logo42 />;
      case "1":
        return <Logo1 />;
      case "regen-1":
        return <LogoRegen1 />;
      case "algorand-mainnet":
        return <LogoAlgorandMainnet />;
      case "solana-mainnet":
        return <LogoSolanaMainnet />;
      default:
        return <LogoChainDefault />;
    }
  };

  return (
    <div
      className="w-7 h-7 flex items-center justify-center rounded-full"
      style={{ backgroundColor: chain.backgroundColor || chain.color }}
    >
      {renderLogo()}
    </div>
  );
};
