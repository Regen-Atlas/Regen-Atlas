export interface Filters {
  assetTypes: Record<string, AssetTypeFilters>;
  provider: string;
  chainId: number | string;
}

export interface AssetTypeFilters {
  id: string;
  name: string;
  subtypes: Array<string>; // ids
}

export interface AssetSubtype {
  id: string;
  name: string;
}

export type FiltersKeys = keyof Filters;
