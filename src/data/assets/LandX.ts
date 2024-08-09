import { Asset } from "../../modules/assets";

export const LandX: Asset = {
  cid: "",
  id: "03595909-bcc0-495a-8ea7-d21be9020314",
  imageHash: "",
  name: "Columbian Farm",
  assetTypeId: "nonpossessory_rights",
  assetSubtypeId: "output_rights",
  description:
    "xToken are tokenized perpetual commodity vaults—i.e. tokenized exposure to the crop share of farmland commodities. Commodity yield is distributed to xToken stakers in cTokens that can be exchanged via the platform at a fair market value of 1KG of the underlying product. For example, one staked xWHEAT token will earn one cWHEAT per year which can be traded for the market value of 1KG of wheat.",
  providerId: "landx",
  providerLink: "https://landx.fi/dashboard/xTokens",
  nativity: "onchain_enforcement",
  geolocation: {
    latitude: 5.337752,
    longitude: -72.408081,
  },
  tokens: [
    {
      chainId: 1,
      contractAddress: "",
    },
    {
      chainId: 42161,
      contractAddress: "",
    },
  ],
  physicalAddress: {
    region: "",
    country: "",
  },
  imageUrl:
    "https://firebasestorage.googleapis.com/v0/b/regen-atlas-mvp.appspot.com/o/v2%2Flandx.jpeg?alt=media",
  createdAt: "2024-07-25T12:10:46.639Z",
  updatedAt: "2024-07-25T12:10:46.639Z",
};
