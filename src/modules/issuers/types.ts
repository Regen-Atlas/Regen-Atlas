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
  | "keenest"
  | "landx"
  | "moss"
  | "nat5"
  | "plastiks"
  | "regen_network"
  | "solidworld"
  | "toucan";
