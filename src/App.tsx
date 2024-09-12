import { Outlet, ScrollRestoration } from "react-router-dom";
import { useScrollClass } from "./shared/hooks/useScrollClass";
import ReactGA from "react-ga4";
import { Helmet, HelmetProvider } from "react-helmet-async";

function App() {
  useScrollClass();
  const isProduction = window.location.hostname.includes("regenatlas.xyz");
  if (isProduction) {
    ReactGA.initialize(import.meta.env.VITE_GOOGLE_ANALYTICS_ID);
  }

  return (
    <HelmetProvider>
      <Helmet>
        <title>Regen Atlas | Green Crypto Marketplace</title>
        <meta
          name="description"
          content="The art of green finance in one global marketplace"
        />
        <meta
          name="keywords"
          content="green crypto, RWA, green RWA, DePin, tokenized assets, green crypto marketplace, RWA marketplace"
        />
        <link rel="icon" href="/RA_logo-02.svg" type="image/svg+xml" />
        <meta
          property="og:title"
          content="Regen Atlas | Green Crypto Marketplace"
        />
        <meta
          property="og:description"
          content="The art of green finance in one global marketplace"
        />
        <meta property="og:url" content="https://regenatlas.xyz" />
        <meta
          property="og:image"
          content="https://regenatlas.xyz/RA_og_image.png"
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Regen Atlas | Green Crypto Marketplace"
        />
        <meta
          name="twitter:description"
          content="The art of green finance in one global marketplace"
        />
        <meta
          name="twitter:image"
          content="https://regenatlas.xyz/RA_twitter_image.png"
        />
        <meta name="twitter:site" content="@theregenatlas" />
      </Helmet>
      <ScrollRestoration />
      <Outlet />
    </HelmetProvider>
  );
}

export default App;
