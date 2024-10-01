import { Outlet, ScrollRestoration } from "react-router-dom";
import { useScrollClass } from "./shared/hooks/useScrollClass";
import { HelmetProvider } from "react-helmet-async";
import { useAnalytics, usePageTracking } from "./modules/analytics";

function App() {
  useScrollClass();
  useAnalytics();
  usePageTracking();

  return (
    <HelmetProvider>
      <ScrollRestoration />
      <Outlet />
    </HelmetProvider>
  );
}

export default App;
