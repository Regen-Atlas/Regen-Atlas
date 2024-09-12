import ReactGA from "react-ga4";

export const analytics = {
  sendPageView: ({ page, title }: { page: string; title: string }) => {
    ReactGA.send({
      hitType: "pageview",
      page,
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
