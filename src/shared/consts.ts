import { MapStyles } from "./types";

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
