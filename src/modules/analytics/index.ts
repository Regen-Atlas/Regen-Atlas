import ReactGA from "react-ga4";

export const analytics = {
  sendPageView: (title: string) => {
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname,
      title,
    });
  },
  sendEvent: ({ category, action }: { category: string; action: string }) => {
    ReactGA.send({
      category,
      action,
    });
  },
  sendTradingEvent: (action: string) => {
    console.log("sendTradingEvent", action);
    ReactGA.send({
      category: "Trading",
      action,
    });
  },
};
