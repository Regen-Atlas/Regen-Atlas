import { Token as UniswapToken } from "@uniswap/sdk-core";
import { Platform } from "../modules/assets";

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

export interface Org {
  id: number;
  name: string;
  status: NewStatus;
  link: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  description: string;
  impact_link: string | null;
  established: string | null;
  address: string | null;
  social: Array<{
    platform: string;
    link: string;
  }>;
  treasury: Array<{
    link: string;
    platform: Platform;
  }>;
  main_image: string | null;
  issuers: Array<{
    id: number;
    name: string;
    status: NewStatus;
  }>;
  ecosystems: Array<{
    id: number;
    name: string;
    status: NewStatus;
    icon: string;
  }>;
}
