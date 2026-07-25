"use client";

import { Button } from "@/app/_components/ui/button";
import ProductCard from "@/app/_components/ui/product-card";
import ProductCardSkeleton from "@/app/_components/ui/product-card-skeleton";
import {
  profileFavoritesQueryOptions,
  profileQueryKeys,
} from "@/lib/profile-queries";
import { clearFavoriteProducts } from "@/services/favorites-service";
import { useFavoritesStore } from "@/stores/favorites.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, Trash } from "iconsax-reactjs";
import Link from "next/link";
import { toast } from "sonner";
import ConfirmDialog from "../_components/confirm-dialog";
import ProfilePageHeader from "../_components/profile-page-header";
import { ProfileEmpty, ProfileError } from "../_components/profile-states";

export default function FavoritesPage() {
  const queryClient = useQueryClient();
  const favoriteIds = useFavoritesStore((state) => state.productIds);
  const favoritesStatus = useFavoritesStore((state) => state.status);
  const initializeFavorites = useFavoritesStore((state) => state.initialize);
  const favoritesQuery = useQuery(profileFavoritesQueryOptions());
  const clearFavorites = useMutation({
    mutationFn: clearFavoriteProducts,
    onSuccess: async () => {
      await initializeFavorites(true);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: profileQueryKeys.favorites,
        }),
        queryClient.invalidateQueries({
          queryKey: profileQueryKeys.dashboard,
        }),
      ]);
      toast.success("علاقه‌مندی‌ها پاک شدند");
    },
    onError: () => toast.error("پاک کردن علاقه‌مندی‌ها ناموفق بود"),
  });
  const products =
    favoritesStatus === "ready"
      ? (favoritesQuery.data ?? []).filter((product) =>
          favoriteIds.includes(product.id),
        )
      : (favoritesQuery.data ?? []);

  return (
    <div className="space-y-5">
      <section className="rounded-xl border bg-white p-4 sm:p-6">
        <ProfilePageHeader
          title="علاقه‌مندی‌ها"
          description={`${products.length.toLocaleString("fa-IR")} محصول از حداکثر ۲۰ محصول`}
          action={
            products.length > 0 ? (
              <ConfirmDialog
                title="پاک کردن علاقه‌مندی‌ها"
                description="همه محصولات ذخیره‌شده از فهرست شما حذف می‌شوند."
                confirmLabel="پاک کردن همه"
                pending={clearFavorites.isPending}
                onConfirm={() => clearFavorites.mutateAsync()}
                trigger={
                  <Button variant="outline" className="text-red-600">
                    <Trash size={17} />
                    پاک کردن همه
                  </Button>
                }
              />
            ) : undefined
          }
        />
      </section>

      {favoritesQuery.isLoading ? (
        <ProductGridSkeleton />
      ) : favoritesQuery.isError ? (
        <ProfileError onRetry={() => void favoritesQuery.refetch()} />
      ) : products.length === 0 ? (
        <ProfileEmpty
          title="فهرست علاقه‌مندی‌ها خالی است"
          description="محصولاتی را که دوست دارید ذخیره کنید تا بعداً سریع‌تر به آن‌ها دسترسی داشته باشید."
          icon={<Heart size={28} />}
          action={
            <Button asChild className="bg-brand-primary">
              <Link href="/products">مشاهده محصولات</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} classname="!w-full" {...product} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
