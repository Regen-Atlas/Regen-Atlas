import { useContext } from "react";
import { FiltersStateContext, NewFiltersStateContext } from "./filtersContext";

export function useFiltersDispatch() {
  const context = useContext(FiltersStateContext);
  if (context === undefined) {
    throw new Error(
      "useFiltersDispatch must be used within a FiltersStateProvider"
    );
  }
  return context.dispatch;
}

export function useNewFiltersDispatch() {
  const context = useContext(NewFiltersStateContext);
  if (context === undefined) {
    throw new Error(
      "useFiltersDispatch must be used within a FiltersStateProvider"
    );
  }
  return context.dispatch;
}
