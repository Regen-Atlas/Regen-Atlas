import { ChainId } from "../chains";
import { IssuerId } from "../issuers";

export interface Asset {
  cid: string;
  id: string;
  name: string;
  description: string;
  assetTypeId: AssetTypeId;
  assetSubtypeId: string;
  providerId: IssuerId;
  learnMoreLink?: string;
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
  nativity?:
    | "native"
    | "tokenized"
    | "onchain_enforcement"
    | "onchain_integration";
  // | "STATUS_QUO"
  // | "ONCHAIN_REPRESENTATION"
  // | "ONCHAIN_INTEGRATION"
  // | "ONCHAIN_ENFORCEMENT"
  // | "FULLY_ONCHAIN";
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
