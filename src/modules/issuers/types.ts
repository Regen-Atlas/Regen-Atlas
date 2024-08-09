export interface IAssetProvider {
  id: IssuerId;
  name: string;
}

export type IssuerId =
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
