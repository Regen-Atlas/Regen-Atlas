import { http, createConfig } from "wagmi";
import { celo } from "wagmi/chains";
import { getDefaultConfig } from "connectkit";

export const config = createConfig(
  getDefaultConfig({
    chains: [celo],
    walletConnectProjectId: import.meta.env.VITE_WC_PROJECT_ID ?? "",
    appName: "RegenAtlas.xyz",
    transports: {
      [celo.id]: http(
        `https://celo-mainnet.infura.io/v3/${import.meta.env.VITE_INFURA_API_KEY}`
      ),
      // [hardhat.id]: http("http://127.0.0.1:8545"),
    },
  })
);

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
