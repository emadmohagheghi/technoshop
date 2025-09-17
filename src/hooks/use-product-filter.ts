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
  const [search, setSearch] = useQueryState("q", parseAsString);
  const [sort, setSort] = useQueryState("sort", parseAsString.withDefault("1"));
  const [special, setSpecial] = useQueryState("special", parseAsString);
  const [price, setPrice] = useQueryState("price", parseAsString);

  const clearFilters = () => {
    setCategory(null);
    setBrand(null);
    setPage(1);
    setSpecial(null);
    setIsAvailable(null);
    setPrice(null);
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
      price,
    },
    setters: {
      setCategory,
      setBrand,
      setSort,
      setPage,
      setSearch,
      setSpecial: (value: boolean) => setSpecial(value ? "true" : null),
      setIsAvailable: (value: boolean) => setIsAvailable(value ? "true" : null),
      setPrice: (min?: number | null, max?: number | null) => {
        // اگر هیچ پارامتری نداده شده، فیلتر را پاک کن
        if (min === null || (min === undefined && max === undefined)) {
          setPrice(null);
          return;
        }

        // مقادیر پیش‌فرض
        const minPrice = min ?? 0;
        const maxPrice = max ?? 500000000;

        setPrice(`${minPrice},${maxPrice}`);
      },
    },
    actions: {
      clearFilters,
      resetPage,
    },
  };
}
