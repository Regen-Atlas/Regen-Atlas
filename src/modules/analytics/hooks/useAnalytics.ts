import ReactGA from "react-ga4";

export const useAnalytics = () => {
  const isProduction = window.location.hostname.includes("regenatlas.xyz");
  if (isProduction) {
    ReactGA.initialize(import.meta.env.VITE_GOOGLE_ANALYTICS_ID);
  }
};
