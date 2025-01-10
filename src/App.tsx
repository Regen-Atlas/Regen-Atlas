import { Outlet, ScrollRestoration } from "react-router-dom";
import { useScrollClass } from "./shared/hooks/useScrollClass";
import { HelmetProvider } from "react-helmet-async";
import { analytics, useAnalytics, usePageTracking } from "./modules/analytics";
import { useSupabaseTable } from "./shared/hooks/useSupabaseTable";
import { AssetTypeWithSubtypes, NewAsset } from "./shared/types";
import { useBaseDispatch, useBaseState } from "./context/base";
import { useEffect } from "react";
import { useNewFiltersDispatch } from "./context/filters";
import { useAccountEffect } from "wagmi";

function App() {
  useScrollClass();
  useAnalytics();
  usePageTracking();
  const dispatchFilters = useNewFiltersDispatch();
  const dispatchBase = useBaseDispatch();
  const baseState = useBaseState();
  const { data: allAssets } = useSupabaseTable<NewAsset>("assets_published");
  const { data: assetTypes } = useSupabaseTable<AssetTypeWithSubtypes>(
    "asset_types_with_subtypes_and_issuers"
  );
  const { data: chains } = useSupabaseTable<{ id: string; name: string }>(
    "chains_with_assets"
  );
  const { data: issuers } = useSupabaseTable<{ id: number; name: string }>(
    "issuers_with_published_assets"
  );

  // Dispatch the chains only when they are loaded and not yet in the baseState
  useEffect(() => {
    if (chains?.length && !baseState.chains.length) {
      dispatchBase({ type: "SET_CHAINS", payload: chains });
    }
  }, [chains, baseState.chains.length, dispatchBase]);

  // Dispatch the asset types only when they are loaded and not yet in the baseState
  useEffect(() => {
    if (assetTypes?.length && !baseState.types.length) {
      dispatchBase({ type: "SET_TYPES", payload: assetTypes });
    }
  }, [assetTypes, baseState.types.length, dispatchBase]);

  // Dispatch the issuers only when they are loaded and not yet in the baseState
  useEffect(() => {
    if (issuers?.length && !baseState.issuers.length) {
      dispatchBase({ type: "SET_ISSUERS", payload: issuers });
    }
  }, [issuers, baseState.issuers.length, dispatchBase]);

  // Dispatch all assets to filters
  useEffect(() => {
    if (allAssets?.length) {
      dispatchFilters({ type: "SET_ALL_ASSETS", payload: allAssets });
    }
  }, [allAssets, dispatchFilters]);

  useAccountEffect({
    onConnect: ({ address }) => {
      analytics.sendEvent({
        category: "Wallet",
        action: "Wallet Connected",
        label: `Address: ${address}`,
      });
    },
    onDisconnect: () => {
      analytics.sendEvent({
        category: "Wallet",
        action: "Wallet Disconnected",
      });
    },
  });

  return (
    <HelmetProvider>
      <ScrollRestoration />
      <Outlet />
    </HelmetProvider>
  );
}

export default App;
