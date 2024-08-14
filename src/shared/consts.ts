import { MapStyles } from "./types";

export const NATIVITY_MAP = {
  native: "Onchain native",
  tokenized: "Tokenized",
  onchain_enforcement: "Onchain enforcement",
};

export const MAP_STYLES: { [key in MapStyles]: string } = {
  map: "mapbox://styles/mapbox/light-v11",
  satellite: "mapbox://styles/mapbox/satellite-streets-v12",
};
