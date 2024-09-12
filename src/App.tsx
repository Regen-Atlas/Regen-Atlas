import { Outlet, ScrollRestoration } from "react-router-dom";
import { useScrollClass } from "./shared/hooks/useScrollClass";
import ReactGA from "react-ga4";

function App() {
  useScrollClass();

  ReactGA.initialize(import.meta.env.VITE_GOOGLE_ANALYTICS_ID);

  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  );
}

export default App;
