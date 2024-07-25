import { AssetProvider } from "../types/asset";

export const PROVIDER_LIST: Array<AssetProvider> = [
  {
    id: "agroforest_dao",
    name: "AgroforestDAO",
  },
  {
    id: "carbon_path",
    name: "CarbonPath",
  },
  {
    id: "coorest",
    name: "Coorest",
  },
  {
    id: "creol",
    name: "Creol",
  },
  {
    id: "ethic_hub",
    name: "EthicHub",
  },
  {
    id: "frigg_eco",
    name: "Frigg.eco",
  },
  {
    id: "glow",
    name: "Glow",
  },
  {
    id: "green_trade",
    name: "GreenTrade",
  },
  {
    id: "helios",
    name: "Helios",
  },
  {
    id: "landx",
    name: "LandX",
  },
  {
    id: "moss",
    name: "Moss",
  },
  {
    id: "nat5",
    name: "Nat5",
  },
  {
    id: "nori",
    name: "Nori",
  },
  {
    id: "plastiks",
    name: "Plastiks",
  },
  {
    id: "regen_network",
    name: "Regen Network",
  },
  {
    id: "senken",
    name: "Senken",
  },
  {
    id: "solidworld",
    name: "Solidworld",
  },
  {
    id: "toucan",
    name: "Toucan",
  },
];

export const PROVIDER_MAP: Record<string, AssetProvider> = PROVIDER_LIST.reduce(
  (acc, provider) => {
    acc[provider.id] = provider;
    return acc;
  },
  {} as Record<string, AssetProvider>
);
