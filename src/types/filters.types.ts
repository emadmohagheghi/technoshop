export interface ProductFilters {
  category: string | null;
  brand: string[] | null;
  sort: string;
  page: number;
  search: string | null;
  special: boolean;
  isAvailable: boolean;
}

export interface ProductFiltersSetters {
  setCategory: (value: string | null) => void;
  setBrand: (value: string[] | null) => void;
  setSort: (value: string) => void;
  setPage: (value: number) => void;
  setSearch: (value: string | null) => void;
  setSpecial: (value: boolean) => void;
  setIsAvailable: (value: boolean) => void;
}

export interface ProductFiltersActions {
  clearFilters: () => void;
  resetPage: () => void;
}

export interface UseProductFiltersReturn {
  filters: ProductFilters;
  setters: ProductFiltersSetters;
  actions: ProductFiltersActions;
}

export const SORT_OPTIONS = [
  { text: "جدید ترین", value: "1" },
  { text: "پر فروش ترین", value: "2" },
  { text: "گران ترین", value: "3" },
  { text: "ارزان ترین", value: "4" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];
