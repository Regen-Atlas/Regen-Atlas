import { ChainBranding } from ".";

export const CHAIN_MAPPING: { [key: number | string]: ChainBranding } = {
  1: {
    name: "Ethereum",
    color: "#444971",
    textColor: "#FFFFFF",
    backgroundColor: "#fff",
  },
  42220: {
    name: "Celo",
    color: "#FCFF52",
    textColor: "#000",
  },
  8453: {
    name: "Base",
    color: "#0052FF",
    textColor: "#fff",
  },
  42161: {
    name: "Arbitrum",
    color: "#213147",
    textColor: "#fff",
  },
  137: {
    name: "Polygon",
    color: "#6C00F6",
    textColor: "#fff",
  },
  42: {
    name: "LUKSO",
    color: "#FE005B",
    textColor: "#fff",
  },
  "regen-1": {
    name: "Regen Ledger",
    color: "#4FB573",
    textColor: "#fff",
  },
  56: {
    name: "BNB Chain",
    color: "#F0B90B",
    textColor: "#fff",
    backgroundColor: "#0B0E11",
  },
  "algorand-mainnet": {
    name: "Algorand",
    color: "#2D2DF1",
    textColor: "#fff",
  },
};

export const CHAINS = [
  {
    id: 1,
    name: "Ethereum",
  },
  {
    id: 42220,
    name: "Celo",
  },
  {
    id: 8453,
    name: "Base",
  },
  {
    id: 42161,
    name: "Arbitrum",
  },
  {
    id: 137,
    name: "Polygon",
  },
  // {
  //   id: 42,
  //   name: "LUKSO",
  // },
  {
    id: "regen-1",
    name: "Regen Ledger",
  },
  {
    id: 56,
    name: "BNB Chain",
  },
  {
    id: "algorand-mainnet",
    name: "Algorand",
  },
];
