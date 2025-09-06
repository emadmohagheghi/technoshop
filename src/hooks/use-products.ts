import { useQuery } from "@tanstack/react-query";
import {
  getProducts,
  getSpecialProducts,
  getNewestProducts,
  getBestSellingProducts,
  getProductByShortSlug,
} from "@/services/products-service";

export function useGetProducts(query?: string) {
  return useQuery({
    queryKey: ["products", query],
    queryFn: () => getProducts(query),
  });
}

export function useGetNewestProducts() {
  return useQuery({
    queryKey: ["newset-products"],
    queryFn: () => getNewestProducts(),
  });
}

export function useGetBestSellingProducts() {
  return useQuery({
    queryKey: ["best-selling-products"],
    queryFn: () => getBestSellingProducts(),
  });
}

export function useGetSpecialProducts() {
  return useQuery({
    queryKey: ["special-products"],
    queryFn: () => getSpecialProducts(),
  });
}

export function useGetProductByShortSlug(shortSlug: number) {
  return useQuery({
    queryKey: ["products", shortSlug],
    queryFn: () => getProductByShortSlug(shortSlug),
  });
}
