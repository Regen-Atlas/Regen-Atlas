import { Platform } from "../../assets";
import { Logo1 } from "../logos/Logo1";
import { Logo137 } from "../logos/Logo137";
import { Logo397 } from "../logos/Logo397";
import { Logo42 } from "../logos/Logo42";
import { Logo42161 } from "../logos/Logo42161";
import { Logo42220 } from "../logos/Logo42220";
import { Logo56 } from "../logos/Logo56";
import { Logo8453 } from "../logos/Logo8453";
import { LogoAlgorandMainnet } from "../logos/LogoAlgorandMainnet";
import { LogoRegen1 } from "../logos/LogoRegen1";
import { LogoSolanaMainnet } from "../logos/LogoSolanaMainnet";

export const ChainTag = ({ platform }: { platform: Platform }) => {
  const renderLogo = () => {
    switch (platform.id) {
      case "celo":
        return <Logo42220 />;
      case "arbitrum-one":
        return <Logo42161 />;
      case "base":
        return <Logo8453 />;
      case "near-protocol":
        return <Logo397 />;
      case "polygon-pos":
        return <Logo137 />;
      case "binance-smart-chain":
        return <Logo56 />;
      case "lukso":
        return <Logo42 />;
      case "ethereum":
        return <Logo1 />;
      case "regen-1":
        return <LogoRegen1 />;
      case "algorand":
        return <LogoAlgorandMainnet />;
      case "solana":
        return <LogoSolanaMainnet />;
      default:
        return (
          <img
            src={platform?.image?.large}
            alt={platform.name}
            className="h-7 w-7 rounded-full"
          />
        );
    }
  };

  return (
    <div
      className="w-7 h-7 flex items-center justify-center rounded-full"
      style={{ backgroundColor: platform.background_color || platform.color }}
    >
      {renderLogo()}
    </div>
  );
};
