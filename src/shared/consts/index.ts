import { ChainId, Token } from "@uniswap/sdk-core";
import { MapStyles } from "../types";

export const CELO_CUSD_TOKEN_ADDRESS =
  "0x765DE816845861e75A25fCA122bb6898B8B1282a";

export const CELO_CELO_TOKEN_ADDRESS =
  "0x471EcE3750Da237f93B8E339c536989b8978a438";

export const CELO_CELO_TOKEN = new Token(
  ChainId.CELO,
  CELO_CELO_TOKEN_ADDRESS,
  18,
  "CELO",
  "Celo"
);

export const NATIVITY_MAP = {
  native: "Onchain native",
  tokenized: "Tokenized",
  onchain_enforcement: "Onchain enforcement",
  onchain_integration: "Onchain Integration",
};

export const NEW_NATIVITY_MAP = {
  STATUS_QUO: "Status Quo",
  ONCHAIN_REPRESENTATION: "Onchain Representation",
  ONCHAIN_INTEGRATION: "Onchain Integration",
  ONCHAIN_ENFORCEMENT: "Onchain Enforcement",
  FULLY_ONCHAIN: "Fully Onchain",
  PRETOKEN: "Pretoken",
};

export const MAP_STYLES: { [key in MapStyles]: string } = {
  map: "mapbox://styles/mapbox/light-v11",
  satellite: "mapbox://styles/mapbox/satellite-streets-v12",
};
