// @ts-ignore
import * as klaro from "klaro";
import { useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { useAccountEffect } from "wagmi";
import klaroConfig from "./TnC/klaroConfig";
import { useBaseDispatch, useBaseState } from "./context/base";
import { useNewFiltersDispatch } from "./context/filters";
import { analytics, useAnalytics, usePageTracking } from "./modules/analytics";
import type { Asset } from "./modules/assets";
import { useScrollClass } from "./shared/hooks/useScrollClass";
import { useSupabaseTable } from "./shared/hooks/useSupabaseTable";
import type { AssetTypeWithSubtypes } from "./shared/types";
import type { Action, Org } from "./shared/types";

function App() {
  useScrollClass();
  useAnalytics();
  usePageTracking();
  const dispatchFilters = useNewFiltersDispatch();
  const dispatchBase = useBaseDispatch();
  const baseState = useBaseState();
  const { data: allAssets } = useSupabaseTable<Asset>("assets_published_view");
  const { data: assetTypes } = useSupabaseTable<AssetTypeWithSubtypes>("asset_types_with_subtypes_and_issuers");
  const { data: platforms } = useSupabaseTable<{ id: number; name: string }>("platforms_with_published_assets");
  const { data: issuers } = useSupabaseTable<{ id: number; name: string }>("issuers_with_published_assets");
  const { data: supabaseOrgs } = useSupabaseTable<Org>("orgs_published_view");
  const { data: supabaseActions } = useSupabaseTable<Action>("actions_published_view");
  // All data from Supabase (populated by regen-atlas-integrations sync)
  const allOrgs = supabaseOrgs || [];
  const allActions = supabaseActions || [];

  // Dispatch the platforms only when they are loaded and not yet in the baseState
  useEffect(() => {
    if (platforms?.length && !baseState.platforms.length) {
      dispatchBase({ type: "SET_PLATFORMS", payload: platforms });
    }
  }, [platforms, baseState.platforms.length, dispatchBase]);

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

  // Dispatch all orgs to filters
  useEffect(() => {
    if (allOrgs.length) {
      dispatchFilters({ type: "SET_ALL_ORGS", payload: allOrgs });
    }
  }, [allOrgs, dispatchFilters]);

  // Dispatch all actions to filters
  useEffect(() => {
    if (allActions.length) {
      dispatchFilters({ type: "SET_ALL_ACTIONS", payload: allActions });
    }
  }, [allActions, dispatchFilters]);

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

  useEffect(() => {
    klaro.setup(klaroConfig);
  }, []);

  return (
    <HelmetProvider>
      <ScrollRestoration />
      <Outlet />
    </HelmetProvider>
  );
}

export default App;
