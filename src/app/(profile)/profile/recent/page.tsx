"use client";

import { Button } from "@/app/_components/ui/button";
import ProductCard from "@/app/_components/ui/product-card";
import ProductCardSkeleton from "@/app/_components/ui/product-card-skeleton";
import {
  clearRecentProducts,
  getRecentProducts,
  removeRecentProduct,
} from "@/services/recent-products-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Clock, Trash } from "iconsax-reactjs";
import Link from "next/link";
import { toast } from "sonner";
import ConfirmDialog from "../_components/confirm-dialog";
import ProfilePageHeader from "../_components/profile-page-header";
import { ProfileEmpty, ProfileError } from "../_components/profile-states";

export default function RecentProductsPage() {
  const queryClient = useQueryClient();
  const recentQuery = useQuery({
    queryKey: ["profile", "recent"],
    queryFn: getRecentProducts,
  });
  const removeRecent = useMutation({
    mutationFn: removeRecentProduct,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profile", "recent"] });
      toast.success("محصول از بازدیدهای اخیر حذف شد");
    },
    onError: () => toast.error("حذف محصول ناموفق بود"),
  });
  const clearRecent = useMutation({
    mutationFn: clearRecentProducts,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profile", "recent"] });
      toast.success("بازدیدهای اخیر پاک شدند");
    },
    onError: () => toast.error("پاک کردن بازدیدهای اخیر ناموفق بود"),
  });
  const products = recentQuery.data ?? [];

  return (
    <div className="space-y-5">
      <section className="rounded-xl border bg-white p-4 sm:p-6">
        <ProfilePageHeader
          title="بازدیدهای اخیر"
          description="محصولاتی که اخیراً مشاهده کرده‌اید."
          action={
            products.length > 0 ? (
              <ConfirmDialog
                title="پاک کردن بازدیدهای اخیر"
                description="تمام سابقه محصولات مشاهده‌شده از حساب شما حذف می‌شود."
                confirmLabel="پاک کردن همه"
                pending={clearRecent.isPending}
                onConfirm={() => clearRecent.mutateAsync()}
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

      {recentQuery.isLoading ? (
        <ProductGridSkeleton />
      ) : recentQuery.isError ? (
        <ProfileError onRetry={() => void recentQuery.refetch()} />
      ) : products.length === 0 ? (
        <ProfileEmpty
          title="هنوز محصولی مشاهده نکرده‌اید"
          description="محصولاتی که می‌بینید برای دسترسی سریع‌تر در این بخش نمایش داده می‌شوند."
          icon={<Clock size={28} />}
          action={
            <Button asChild className="bg-brand-primary">
              <Link href="/products">مشاهده محصولات</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <div key={product.id} className="flex min-w-0 flex-col gap-2">
              <ProductCard classname="!w-full" {...product} />
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600"
                disabled={
                  removeRecent.isPending &&
                  removeRecent.variables === product.id
                }
                onClick={() => removeRecent.mutate(product.id)}
              >
                <Trash size={15} />
                حذف از سابقه
              </Button>
            </div>
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
