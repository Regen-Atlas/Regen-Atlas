import { Asset } from "../../modules/assets";

export const MundoRep: Asset = {
  cid: "",
  id: "795e674a-c747-4b8b-a1d5-0550cf946ed5",
  imageHash: "",
  name: "MundoRep",
  assetTypeId: "derivatives",
  assetSubtypeId: "non_carbon_environmental_process_derivatives",
  description:
    "NFT issued to buyers of Plastic Cleanup Forward Contracts.\n\nMundorep is a Costa Rican company specialized in recycling and transforming plastic raw materials with high added value. By recycling 187 million plastic bags annually, this company has a positive impact on both the environment and society.",
  providerId: "plastiks",
  providerLink:
    "https://app.plastiks.io/users/mundorep/recovery_entity_profile?action=show&controller=users&id=mundorep",
  nativity: "native",
  geolocation: {
    latitude: 10.365872,
    longitude: -83.931713,
  },
  tokens: [
    {
      chainId: 42220,
      contractAddress: "0x27cd006548dF7C8c8e9fdc4A67fa05C2E3CA5CF9",
    },
  ],
  physicalAddress: {
    region: "Heredia Province",
    country: "CR",
  },
  imageUrl:
    "https://firebasestorage.googleapis.com/v0/b/regen-atlas-mvp.appspot.com/o/v2%2Fplastic.jpg?alt=media",
  createdAt: "2024-07-06T22:12:13.428Z",
  updatedAt: "2024-07-06T22:12:13.428Z",
};
