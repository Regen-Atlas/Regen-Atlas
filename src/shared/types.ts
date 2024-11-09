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

export interface NewAsset {
  id: string;
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  issuer: NewIssuer;
  description: string;
  nativity: AssetNativity;
  status: NewStatus;
  issuer_link: string;
  exchange_link: string;
  main_image: string;
  tokens: {
    address: string;
    name: string;
    symbol: string;
    chain_id: string;
  }[];
  chains: {
    id: string;
    name: string;
  }[];
  asset_subtypes: {
    id: number;
    name: string;
  }[];
  asset_types: {
    id: number;
    name: string;
  }[];
  country_code: string;
  region: string;
  child_assets: Array<{
    id: string;
    name: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  }>;
  parent_assets: Array<{
    id: string;
    name: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  }>;
  certifications: Array<{
    id: 4;
    value: 80;
    description: "80/100";
    certifier: {
      id: 1;
      name: "Particula";
    };
  }>;
}

export interface AssetTypeWithSubtypes {
  id: number;
  name: string;
  asset_subtypes: {
    id: number;
    name: string;
  }[];
}
