import ReactGA from "react-ga4";

export const useAnalytics = () => {
  const isProduction = window.location.hostname.includes("regenatlas.xyz");
  const isLocal = window.location.hostname.includes("localhost");
  if (isProduction || isLocal) {
    ReactGA.initialize(import.meta.env.VITE_GOOGLE_ANALYTICS_ID);
  }
};
