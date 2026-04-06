import { Buffer } from "buffer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider } from "connectkit";
import React from "react";
import ReactDOM from "react-dom/client";
import { Link, Navigate, RouterProvider, createBrowserRouter, useRouteError } from "react-router-dom";
import { WagmiProvider } from "wagmi";

import App from "./App.tsx";
import { config } from "./wagmi.ts";

import "./index.css";
import "mapbox-gl/dist/mapbox-gl.css";
import About from "./About/About.tsx";
import ActionDetails from "./Actions/ActionDetails.tsx";
import AddAsset from "./AddAsset.tsx";
import AgentDetails from "./Agents/AgentDetails.tsx";
import AssetDetails from "./AssetDetails/AssetDetails.tsx";
import Explore from "./Explore/Explore.tsx";
import { Kitchensink } from "./Kitchensink/Kitchensink.tsx";
import ListProject from "./ListProject/ListProject.tsx";
import OrgDetails from "./Orgs/OrgDetails.tsx";
import { Imprint } from "./TnC/Imprint.tsx";
import { PrivacyPolicy } from "./TnC/PrivacyPolicy.tsx";
import { BaseStateProvider } from "./context/base/baseContext.tsx";
import { NewFiltersStateProvider } from "./context/filters/filtersContext.tsx";
import { MapStateProvider } from "./context/map/mapContext.tsx";

globalThis.Buffer = Buffer;

const queryClient = new QueryClient();

function RouteError() {
  const error = useRouteError() as Error;
  const isExtensionError =
    error?.message?.includes("removeChild") ||
    error?.message?.includes("insertBefore") ||
    error?.message?.includes("not a child of this node");

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-8">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        {isExtensionError ? (
          <p className="text-base-content/70 mb-6">
            A browser extension (likely a wallet) interfered with the page. Try disabling wallet extensions or using an
            incognito window.
          </p>
        ) : (
          <p className="text-base-content/70 mb-6">{error?.message || "An unexpected error occurred."}</p>
        )}
        <Link to="/" className="btn btn-primary" reloadDocument>
          Reload
        </Link>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <RouteError />,
    children: [
      {
        path: "/",
        element: <Explore />,
      },
      {
        path: "/add-asset",
        element: <AddAsset />,
      },
      {
        path: "/assets/:assetId",
        element: <AssetDetails />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/imprint",
        element: <Imprint />,
      },
      {
        path: "/orgs",
        element: <Navigate to="/?entity=actor" replace />,
      },
      {
        path: "/orgs/:id",
        element: <OrgDetails />,
      },
      {
        path: "/actions",
        element: <Navigate to="/?entity=action" replace />,
      },
      {
        path: "/actions/:id",
        element: <ActionDetails />,
      },
      {
        path: "/agents/:address",
        element: <AgentDetails />,
      },
      {
        path: "/list",
        element: <ListProject />,
      },
    ],
  },
  {
    path: "/kitchensink",
    element: <Kitchensink />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider theme="soft">
          <BaseStateProvider>
            <NewFiltersStateProvider>
              <MapStateProvider>
                <RouterProvider router={router} />
              </MapStateProvider>
            </NewFiltersStateProvider>
          </BaseStateProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
);
