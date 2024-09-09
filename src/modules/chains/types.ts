export type ChainId =
  | 1
  | 42220
  | 8453
  | 42161
  | 137
  | 42
  | "regen-1"
  | 56
  | "algorand-mainnet";

export interface ChainBranding {
  name: string;
  color: string;
  backgroundColor?: string;
  textColor: string;
}
