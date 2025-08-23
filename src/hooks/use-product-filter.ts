"use client";

import {
  useQueryState,
  parseAsString,
  parseAsInteger,
  parseAsArrayOf,
} from "nuqs";
import { UseProductFiltersReturn } from "@/types/filters.types";

export function useProductsFilters(): UseProductFiltersReturn {
  const [isAvailable, setIsAvailable] = useQueryState(
    "available",
    parseAsString,
  );
  const [brand, setBrand] = useQueryState(
    "brand",
    parseAsArrayOf(parseAsString),
  );
  const [category, setCategory] = useQueryState("category", parseAsString);
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [search, setSearch] = useQueryState("search", parseAsString);
  const [sort, setSort] = useQueryState("sort", parseAsString.withDefault("1"));
  const [special, setSpecial] = useQueryState("special", parseAsString);

  const clearFilters = () => {
    setCategory(null);
    setBrand(null);
    setPage(1);
    setSearch(null);
    setSpecial(null);
    setIsAvailable(null);
  };

  const resetPage = () => {
    setPage(1);
  };

  return {
    filters: {
      category,
      brand,
      sort,
      page,
      search,
      special: special === "true",
      isAvailable: isAvailable === "true",
    },
    setters: {
      setCategory,
      setBrand,
      setSort,
      setPage,
      setSearch,
      setSpecial: (value: boolean) => setSpecial(value ? "true" : null),
      setIsAvailable: (value: boolean) => setIsAvailable(value ? "true" : null),
    },
    actions: {
      clearFilters,
      resetPage,
    },
  };
}
