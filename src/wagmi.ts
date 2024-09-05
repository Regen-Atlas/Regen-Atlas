import { http, createConfig } from "wagmi";
import {
  baseSepolia,
  celo,
  celoAlfajores,
  hardhat,
  mainnet,
  sepolia,
} from "wagmi/chains";
import { getDefaultConfig } from "connectkit";

export const config = createConfig(
  getDefaultConfig({
    chains: [baseSepolia, mainnet, sepolia, celo, celoAlfajores, hardhat],
    walletConnectProjectId: import.meta.env.VITE_WC_PROJECT_ID ?? "",
    appName: "RegenAtlas.xyz",
    transports: {
      [baseSepolia.id]: http(
        `https://base-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY_BASE_SEPOLIA}`
      ),
      [mainnet.id]: http(
        `https://mainnet.infura.io/v3/${import.meta.env.VITE_INFURA_API_KEY}`
      ),
      [sepolia.id]: http(
        `https://sepolia.infura.io/v3/${import.meta.env.VITE_INFURA_API_KEY}`
      ),
      [celo.id]: http(
        `https://celo-mainnet.infura.io/v3/${import.meta.env.VITE_INFURA_API_KEY}`
      ),
      [celoAlfajores.id]: http(
        `https://celo-alfajores.infura.io/v3/${import.meta.env.VITE_INFURA_API_KEY}`
      ),
      [hardhat.id]: http("http://127.0.0.1:8545"),
    },
  })
);

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
