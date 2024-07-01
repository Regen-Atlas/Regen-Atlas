import { http, createConfig } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { getDefaultConfig } from "connectkit";

export const config = createConfig(
  getDefaultConfig({
    chains: [baseSepolia],
    walletConnectProjectId: import.meta.env.VITE_WC_PROJECT_ID ?? "",
    appName: "RegenAtlas.xyz",
    transports: {
      [baseSepolia.id]: http(
        `https://base-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY_BASE_SEPOLIA}`
      ),
    },
  })
);

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
