import { ChainId } from "./chains";

export interface Asset {
  cid: string;
  id: string;
  name: string;
  description: string;
  assetTypeId: AssetTypeId;
  assetSubtypeId: string;
  providerId: ProviderId;
  providerLink: string;
  tokens?: Array<{
    chainId: ChainId;
    contractAddress: string;
  }>;
  geolocation: {
    latitude: number;
    longitude: number;
  };
  physicalAddress: {
    region: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
  imageHash: string;
  nativity?: "native" | "tokenized" | "onchain_enforcement";
  imageUrl?: string;
}

export interface AssetCreateStructure {
  name: string;
  description: string;
  assetTypeId: string;
  assetSubtypeId: string;
  providerId: string;
  providerLink: string;
  geolocation: {
    latitude: number;
    longitude: number;
  };
}

export interface AssetProvider {
  id: ProviderId;
  name: string;
}

export type AssetTypeId =
  | "ownership"
  | "nonpossessory_rights"
  | "environmental_process_tokens"
  | "debt"
  | "derivatives"
  | "currency";

export interface AssetType {
  id: AssetTypeId;
  name: string;
  subtypes: AssetSubtype[];
}

export interface AssetSubtype {
  id: string;
  name: string;
  assetTypeId: string;
}

export type ProviderId =
  | "agroforest_dao"
  | "carbon_path"
  | "ethic_hub"
  | "glow"
  | "helios"
  | "moss"
  | "nat5"
  | "nori"
  | "plastiks"
  | "regen_network"
  | "solidworld"
  | "toucan"
  | "landx";
