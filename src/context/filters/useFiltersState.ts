import { useContext } from "react";
import { FiltersStateContext } from "./filtersContext";

export function useFiltersState() {
  const context = useContext(FiltersStateContext);
  if (context === undefined) {
    throw new Error(
      "useFiltersState must be used within a FiltersStateProvider"
    );
  }
  return context.state;
}
