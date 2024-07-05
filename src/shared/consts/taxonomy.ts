import { AssetSubtype, AssetType } from "../types";

// Asset subtypes

// Ownership Types:

export const NATURAL_ASSET_OWNERSHIP: AssetSubtype = {
  id: "natural_asset_ownership",
  name: "Natural Asset Ownership",
  assetTypeId: "ownership",
};

export const GREEN_DIGITAL_COLLECTIBLES: AssetSubtype = {
  id: "green_digital_collectibles",
  name: '"Green" Digital Collectibles',
  assetTypeId: "ownership",
};

export const GREEN_DIGIPHYSICAL_GOODS: AssetSubtype = {
  id: "green_digiphysical_goods",
  name: '"Green" Digiphysical Goods',
  assetTypeId: "ownership",
};

export const RENEWABLE_RWAS: AssetSubtype = {
  id: "renewable_rwas",
  name: "Renewable Real-world Assets (RWAs)",
  assetTypeId: "ownership",
};

export const ECOLOGICAL_DATA_RIGHTS: AssetSubtype = {
  id: "ecological_data_rights",
  name: "Ecological Data Rights",
  assetTypeId: "ownership",
};

// Nonpossessory Rights Types:

export const NATURAL_ASSET_COMPANY_SHARES: AssetSubtype = {
  id: "natural_asset_company_shares",
  name: "Natural Asset Company shares",
  assetTypeId: "nonpossessory_rights",
};

export const OUTPUT_RIGHTS: AssetSubtype = {
  id: "output_rights",
  name: "Output Rights (Profit-à-prendre)",
  assetTypeId: "nonpossessory_rights",
};

export const SOCIAL_UTILITY_RIGHTS: AssetSubtype = {
  id: "social_utility_rights",
  name: "Some other social utility or use right",
  assetTypeId: "nonpossessory_rights",
};

// Environmental Process Tokens Types:

export const CARBON_OFFSETS_NEGATIVE: AssetSubtype = {
  id: "carbon_offsets_negative",
  name: "Carbon Offsets - Negative",
  assetTypeId: "environmental_process_tokens",
};

export const CARBON_OFFSETS_COUNTERFACTUAL: AssetSubtype = {
  id: "carbon_offsets_counterfactual",
  name: "Carbon Offsets - Counterfactual",
  assetTypeId: "environmental_process_tokens",
};

export const CARBON_CREDITS: AssetSubtype = {
  id: "carbon_credits",
  name: "Carbon Credits",
  assetTypeId: "environmental_process_tokens",
};

export const NON_CARBON_CREDITS: AssetSubtype = {
  id: "non_carbon_credits",
  name: "Biodiversity, Plastic, Energy and Other Non-Carbon Credits",
  assetTypeId: "environmental_process_tokens",
};

export const RECS: AssetSubtype = {
  id: "recs",
  name: "Renewable Energy Certificates (RECs)",
  assetTypeId: "environmental_process_tokens",
};

// Debt Types:

export const GREEN_BLUE_IMPACT_BONDS: AssetSubtype = {
  id: "green_blue_impact_bonds",
  name: '"Green," "Blue," or "Impact" Bonds',
  assetTypeId: "debt",
};

export const GREEN_RWAS_DEBT_FINANCE: AssetSubtype = {
  id: "green_rwas_debt_finance",
  name: '"Green" Real-world Asset Debt Finance',
  assetTypeId: "debt",
};

// Derivatives Types:

export const CARBON_FORWARDS_FUTURES: AssetSubtype = {
  id: "carbon_forwards_futures",
  name: "Carbon Forwards and Futures",
  assetTypeId: "derivatives",
};

export const COMMODITY_DERIVATIVES: AssetSubtype = {
  id: "commodity_derivatives",
  name: "Commodity Derivatives",
  assetTypeId: "derivatives",
};

export const NON_CARBON_ENVIRONMENTAL_PROCESS_DERIVATIVES: AssetSubtype = {
  id: "non_carbon_environmental_process_derivatives",
  name: "Non-Carbon Environmental Process Derivatives",
  assetTypeId: "derivatives",
};

export const PPAS: AssetSubtype = {
  id: "ppas",
  name: "Power Purchasing Agreements (PPAs)",
  assetTypeId: "derivatives",
};

export const GREEN_YIELD_TOKENS: AssetSubtype = {
  id: "green_yield_tokens",
  name: '"Green" Yield Tokens',
  assetTypeId: "derivatives",
};

export const PARAMETRIC_INSURANCE: AssetSubtype = {
  id: "parametric_insurance",
  name: "Parametric Insurance",
  assetTypeId: "derivatives",
};

export const GREEN_LP_TOKENS: AssetSubtype = {
  id: "green_lp_tokens",
  name: '"Green" Liquidity Provider Tokens (LP Tokens)',
  assetTypeId: "derivatives",
};

// Currency Types:

export const GREEN_MONEY: AssetSubtype = {
  id: "green_money",
  name: '"Green" Money or Nature-backed Currencies',
  assetTypeId: "currency",
};

export const GREEN_FLATCOINS: AssetSubtype = {
  id: "green_flatcoins",
  name: '"Green" Flatcoins',
  assetTypeId: "currency",
};

export const GREEN_TRACERCOINS: AssetSubtype = {
  id: "green_tracercoins",
  name: '"Green" Tracercoins',
  assetTypeId: "currency",
};

// Asset types
const Ownership: AssetType = {
  id: "ownership",
  name: "Ownership",
  subtypes: [
    NATURAL_ASSET_OWNERSHIP,
    GREEN_DIGITAL_COLLECTIBLES,
    GREEN_DIGIPHYSICAL_GOODS,
    RENEWABLE_RWAS,
    ECOLOGICAL_DATA_RIGHTS,
  ],
};

const NonpossessoryRights: AssetType = {
  id: "nonpossessory_rights",
  name: "Nonpossessory Rights",
  subtypes: [
    NATURAL_ASSET_COMPANY_SHARES,
    OUTPUT_RIGHTS,
    SOCIAL_UTILITY_RIGHTS,
  ],
};

const EnvironmentalProcessTokens: AssetType = {
  id: "environmental_process_tokens",
  name: "Environmental Process Tokens",
  subtypes: [
    CARBON_OFFSETS_NEGATIVE,
    CARBON_OFFSETS_COUNTERFACTUAL,
    CARBON_CREDITS,
    NON_CARBON_CREDITS,
    RECS,
  ],
};

const Debt: AssetType = {
  id: "debt",
  name: "Debt",
  subtypes: [GREEN_BLUE_IMPACT_BONDS, GREEN_RWAS_DEBT_FINANCE],
};

const Derivatives: AssetType = {
  id: "derivatives",
  name: "Derivatives",
  subtypes: [
    CARBON_FORWARDS_FUTURES,
    COMMODITY_DERIVATIVES,
    NON_CARBON_ENVIRONMENTAL_PROCESS_DERIVATIVES,
    PPAS,
    GREEN_YIELD_TOKENS,
    PARAMETRIC_INSURANCE,
    GREEN_LP_TOKENS,
  ],
};

const Currency: AssetType = {
  id: "currency",
  name: "Currency",
  subtypes: [GREEN_MONEY, GREEN_FLATCOINS, GREEN_TRACERCOINS],
};

export const ASSET_TYPES_MAP: Record<string, AssetType> = {
  ownership: Ownership,
  nonpossessory_rights: NonpossessoryRights,
  environmental_process_tokens: EnvironmentalProcessTokens,
  debt: Debt,
  derivatives: Derivatives,
  currency: Currency,
};

export const ASSET_TYPES: AssetType[] = [
  {
    id: "ownership",
    name: "Ownership",
    subtypes: [
      NATURAL_ASSET_OWNERSHIP,
      GREEN_DIGITAL_COLLECTIBLES,
      GREEN_DIGIPHYSICAL_GOODS,
      RENEWABLE_RWAS,
      ECOLOGICAL_DATA_RIGHTS,
    ],
  },
  {
    id: "nonpossessory_rights",
    name: "Nonpossessory Rights",
    subtypes: [
      NATURAL_ASSET_COMPANY_SHARES,
      OUTPUT_RIGHTS,
      SOCIAL_UTILITY_RIGHTS,
    ],
  },
  {
    id: "environmental_process_tokens",
    name: "Environmental Process Tokens",
    subtypes: [
      CARBON_OFFSETS_NEGATIVE,
      CARBON_OFFSETS_COUNTERFACTUAL,
      CARBON_CREDITS,
      NON_CARBON_CREDITS,
      RECS,
    ],
  },
  {
    id: "debt",
    name: "Debt",
    subtypes: [GREEN_BLUE_IMPACT_BONDS, GREEN_RWAS_DEBT_FINANCE],
  },
  {
    id: "derivatives",
    name: "Derivatives",
    subtypes: [
      CARBON_FORWARDS_FUTURES,
      COMMODITY_DERIVATIVES,
      NON_CARBON_ENVIRONMENTAL_PROCESS_DERIVATIVES,
      PPAS,
      GREEN_YIELD_TOKENS,
      PARAMETRIC_INSURANCE,
      GREEN_LP_TOKENS,
    ],
  },
  {
    id: "currency",
    name: "Currency",
    subtypes: [GREEN_MONEY, GREEN_FLATCOINS, GREEN_TRACERCOINS],
  },
];
