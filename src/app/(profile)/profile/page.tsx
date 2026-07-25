"use client";

import { Button } from "@/app/_components/ui/button";
import ProductCard from "@/app/_components/ui/product-card";
import ProductCardSkeleton from "@/app/_components/ui/product-card-skeleton";
import { profileDashboardQueryOptions } from "@/lib/profile-queries";
import type { Product } from "@/types/product.types";
import { useUserStore } from "@/stores/user.store";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft2,
  Bag2,
  Heart,
  Location,
  ProfileCircle,
  TickCircle,
} from "iconsax-reactjs";
import Link from "next/link";
import OrderCard from "./_components/order-card";
import ProfilePageHeader from "./_components/profile-page-header";
import { ProfileError, ProfileLoading } from "./_components/profile-states";

const quickActions = [
  {
    href: "/profile/orders",
    label: "سفارش‌های من",
    description: "پیگیری و مشاهده جزئیات",
    icon: Bag2,
  },
  {
    href: "/profile/addresses",
    label: "آدرس‌ها",
    description: "افزودن یا ویرایش آدرس",
    icon: Location,
  },
  {
    href: "/profile/favorites",
    label: "علاقه‌مندی‌ها",
    description: "محصولات ذخیره‌شده",
    icon: Heart,
  },
  {
    href: "/profile/account",
    label: "اطلاعات فردی",
    description: "تکمیل و ویرایش حساب",
    icon: ProfileCircle,
  },
];

export default function ProfilePage() {
  const user = useUserStore((state) => state.user);
  const dashboardQuery = useQuery(profileDashboardQueryOptions());
  const completedFields = [
    user?.first_name,
    user?.last_name,
    user?.national_code,
    user?.phone,
    user?.email,
  ].filter(Boolean).length;
  const completion = Math.round((completedFields / 5) * 100);
  const orders = dashboardQuery.data?.orders;
  const latestOrder = orders?.latest_order;

  return (
    <div className="space-y-5">
      <section className="bg-brand-primary overflow-hidden rounded-xl p-5 text-white sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-white/70">خوش آمدید</p>
            <h1 className="mt-2 text-xl font-bold sm:text-2xl">
              {user?.full_name || user?.phone || "کاربر تکنوشاپ"}
            </h1>
            <div className="mt-3 flex items-center gap-2 text-sm text-white/80">
              <TickCircle size={18} />
              {user?.is_verify ? "حساب تأیید شده" : "تکمیل اطلاعات حساب"}
            </div>
          </div>
          <div className="w-full max-w-xs rounded-xl bg-white/10 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between text-sm">
              <span>تکمیل پروفایل</span>
              <span>{completion.toLocaleString("fa-IR")}٪</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white transition-all"
                style={{ width: `${completion}%` }}
              />
            </div>
            {completion < 100 && (
              <Button asChild variant="secondary" className="mt-4 w-full">
                <Link href="/profile/account">تکمیل اطلاعات</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-xl border bg-white p-4 sm:p-5">
        <ProfilePageHeader
          title="وضعیت سفارش‌ها"
          description="خلاصه‌ای از خریدهای اخیر شما"
          action={
            <Button asChild variant="ghost">
              <Link href="/profile/orders">
                مشاهده همه
                <ArrowLeft2 size={16} />
              </Link>
            </Button>
          }
        />
        {dashboardQuery.isLoading ? (
          <div className="mt-5">
            <ProfileLoading cards={1} />
          </div>
        ) : dashboardQuery.isError ? (
          <div className="mt-5">
            <ProfileError onRetry={() => void dashboardQuery.refetch()} />
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              ["همه سفارش‌ها", orders?.counts.all ?? 0],
              ["در حال انجام", orders?.counts.current ?? 0],
              ["تحویل‌شده", orders?.counts.delivered ?? 0],
              ["لغوشده", orders?.counts.canceled ?? 0],
            ].map(([label, count]) => (
              <div key={label} className="rounded-xl bg-gray-100 p-4">
                <p className="text-brand-primary text-2xl font-bold">
                  {Number(count).toLocaleString("fa-IR")}
                </p>
                <p className="mt-1 text-sm text-gray-600">{label}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {latestOrder && (
        <section className="space-y-3">
          <ProfilePageHeader title="آخرین سفارش" />
          <OrderCard order={latestOrder} />
        </section>
      )}

      <section className="rounded-xl border bg-white p-4 sm:p-5">
        <ProfilePageHeader title="دسترسی سریع" />
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group hover:border-brand-primary hover:bg-brand-primary-content/30 rounded-xl border p-4 transition-colors"
              >
                <div className="bg-brand-primary-content text-brand-primary grid size-10 place-items-center rounded-lg">
                  <Icon size={22} />
                </div>
                <p className="mt-3 font-semibold text-gray-900">{item.label}</p>
                <p className="mt-1 text-xs text-gray-500">{item.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <ProductPreview
        title="علاقه‌مندی‌های شما"
        href="/profile/favorites"
        products={dashboardQuery.data?.favorite_products}
        loading={dashboardQuery.isLoading}
      />
      <ProductPreview
        title="بازدیدهای اخیر"
        href="/profile/recent"
        products={dashboardQuery.data?.recent_products}
        loading={dashboardQuery.isLoading}
      />
    </div>
  );
}

function ProductPreview({
  title,
  href,
  products,
  loading,
}: {
  title: string;
  href: string;
  products?: Product[];
  loading: boolean;
}) {
  if (!loading && (!products || products.length === 0)) return null;
  return (
    <section className="rounded-xl border bg-white p-4 sm:p-5">
      <ProfilePageHeader
        title={title}
        action={
          <Button asChild variant="ghost">
            <Link href={href}>
              مشاهده همه
              <ArrowLeft2 size={16} />
            </Link>
          </Button>
        }
      />
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
          : products
              ?.slice(0, 4)
              .map((product) => (
                <ProductCard
                  key={product.id}
                  classname="!w-full"
                  {...product}
                />
              ))}
      </div>
    </section>
  );
}
