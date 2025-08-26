"use client";
import { useGetProducts } from "@/hooks/use-products";
import { useProductsFilters } from "@/hooks/use-product-filter";
import ProductCard from "@/app/_components/ui/product-card";
import ProductCardSkeleton from "@/app/_components/ui/product-card-skeleton";
import { Warning2, Box } from "iconsax-reactjs";
import { Product } from "@/types/product.types";
import { useMemo } from "react";

export default function ProductsGrid() {
  const {
    filters: { sort, category, brand, special, price },
  } = useProductsFilters();

  // Memoize query string for performance
  const queryString = useMemo(() => {
    const queryParams = new URLSearchParams();
    if (sort) queryParams.append("sort", sort);
    if (category) queryParams.append("categorySlug", category);
    if (brand) queryParams.append("brand", brand.toString());
    if (special) queryParams.append("special", "true");
    if (price) queryParams.append("price", price);
    return queryParams.toString() ? `?${queryParams.toString()}` : "";
  }, [sort, category, brand, special, price]);

  const {
    data: products,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetProducts(queryString);

  if (isLoading || isFetching) {
    return <ProductsGridSkeleton count={12} />;
  }

  if (error) {
    return <ErrorState onRetry={refetch} />;
  }

  if (!products || products.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {products.map((product: Product) => (
          <div
            key={product.id}
            className="flex w-full justify-center rounded-lg"
          >
            <ProductCard classname="!w-full" {...product} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Skeleton component for loading state
function ProductsGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="flex w-full justify-center rounded-lg">
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}

// Error state component
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-[#fff] p-12 text-center shadow-sm">
      <Warning2 size={48} className="mb-4 text-red-500" />
      <h3 className="mb-2 text-lg font-semibold text-gray-900">
        خطا در بارگذاری محصولات
      </h3>
      <p className="mb-4 text-gray-600">
        متاسفانه امکان دریافت محصولات وجود ندارد
      </p>
      <button
        onClick={onRetry}
        className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        تلاش مجدد
      </button>
    </div>
  );
}

// Empty state component
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-[#fff] p-12 text-center shadow-sm">
      <Box size={48} className="mb-4 text-gray-400" />
      <h3 className="mb-2 text-lg font-semibold text-gray-900">
        محصولی یافت نشد
      </h3>
      <p className="text-gray-600">با فیلترهای انتخابی شما محصولی موجود نیست</p>
    </div>
  );
}
