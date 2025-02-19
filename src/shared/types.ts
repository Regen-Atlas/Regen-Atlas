import { Token as UniswapToken } from "@uniswap/sdk-core";

export type MapStyles = "map" | "satellite";

export type NewStatus = "DRAFT" | "PUBLISHED" | "DELETED";

export interface NewIssuer {
  id: number;
  name: string;
  status?: NewStatus;
  deleted_at?: Date | null;
}

export type AssetNativity =
  | "STATUS_QUO"
  | "ONCHAIN_REPRESENTATION"
  | "ONCHAIN_INTEGRATION"
  | "ONCHAIN_ENFORCEMENT"
  | "FULLY_ONCHAIN"
  | "PRETOKEN";

export interface AssetTypeWithSubtypes {
  id: number;
  name: string;
  asset_subtypes: {
    id: number;
    name: string;
    total_asset_count?: number;
    issuer_counts?: Array<{
      issuer_id: number;
      asset_count: number;
    }>;
  }[];
}

export interface Token extends UniswapToken {
  symbol: string;
}
