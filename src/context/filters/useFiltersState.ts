import { useContext } from "react";
import { FiltersStateContext, NewFiltersStateContext } from "./filtersContext";

export function useFiltersState() {
  const context = useContext(FiltersStateContext);
  if (context === undefined) {
    throw new Error(
      "useFiltersState must be used within a FiltersStateProvider"
    );
  }
  return context.state;
}

export function useNewFiltersState() {
  const context = useContext(NewFiltersStateContext);
  if (context === undefined) {
    throw new Error(
      "useFiltersState must be used within a FiltersStateProvider"
    );
  }
  return context.state;
}
