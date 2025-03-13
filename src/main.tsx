import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Buffer } from "buffer";
import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider } from "wagmi";
import { ConnectKitProvider } from "connectkit";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.tsx";
import { config } from "./wagmi.ts";

import "./index.css";
import "mapbox-gl/dist/mapbox-gl.css";
import Explore from "./Explore/Explore.tsx";
import AddAsset from "./AddAsset.tsx";
import { NewFiltersStateProvider } from "./context/filters/filtersContext.tsx";
import AssetDetails from "./AssetDetails/AssetDetails.tsx";
import { MapStateProvider } from "./context/map/mapContext.tsx";
import { Kitchensink } from "./Kitchensink/Kitchensink.tsx";
import { BaseStateProvider } from "./context/base/baseContext.tsx";
import { PrivacyPolicy } from "./TnC/PrivacyPolicy.tsx";
import { Imprint } from "./TnC/Imprint.tsx";

globalThis.Buffer = Buffer;

const queryClient = new QueryClient();

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/imprint",
        element: <Imprint />,
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
  </React.StrictMode>
);
