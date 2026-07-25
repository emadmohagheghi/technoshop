"use client";

import { Button } from "@/app/_components/ui/button";
import { profileOrdersQueryOptions } from "@/lib/profile-queries";
import type { ProfileOrderStatus } from "@/types/order.types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bag2 } from "iconsax-reactjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import OrderCard from "../_components/order-card";
import ProfilePageHeader from "../_components/profile-page-header";
import {
  ProfileEmpty,
  ProfileError,
  ProfileLoading,
} from "../_components/profile-states";
import { cn } from "@/lib/utils";

type OrderTab = Exclude<ProfileOrderStatus, "pending_payment">;

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderTab>("all");
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const ordersQuery = useQuery(profileOrdersQueryOptions(activeTab, page));
  const data = ordersQuery.data;
  const orders = data?.data ?? [];

  useEffect(() => {
    if (
      !ordersQuery.isPlaceholderData &&
      data?.status === activeTab &&
      data.has_next
    ) {
      void queryClient.prefetchQuery(
        profileOrdersQueryOptions(activeTab, page + 1),
      );
    }
  }, [
    activeTab,
    data?.has_next,
    data?.status,
    ordersQuery.isPlaceholderData,
    page,
    queryClient,
  ]);
  const tabs: { id: OrderTab; label: string; count: number }[] = [
    { id: "all", label: "همه", count: data?.counts.all ?? 0 },
    {
      id: "current",
      label: "جاری",
      count: data?.counts.current ?? 0,
    },
    {
      id: "delivered",
      label: "تحویل‌شده",
      count: data?.counts.delivered ?? 0,
    },
    {
      id: "canceled",
      label: "لغوشده",
      count: data?.counts.canceled ?? 0,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-xl border bg-white p-4 sm:p-6">
        <ProfilePageHeader
          title="سفارش‌های من"
          description="وضعیت خریدها را پیگیری کنید و جزئیات هر سفارش را ببینید."
        />
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              className={cn(
                "shrink-0",
                activeTab === tab.id &&
                  "bg-brand-primary hover:bg-brand-primary-focus",
              )}
              onClick={() => {
                setActiveTab(tab.id);
                setPage(1);
              }}
            >
              {tab.label}
              <span
                className={cn(
                  "rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700",
                  activeTab === tab.id && "bg-white/20 text-white",
                )}
              >
                {tab.count.toLocaleString("fa-IR")}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {ordersQuery.isLoading ? (
        <ProfileLoading />
      ) : ordersQuery.isError ? (
        <ProfileError onRetry={() => void ordersQuery.refetch()} />
      ) : orders.length === 0 ? (
        <ProfileEmpty
          title="سفارشی در این بخش نیست"
          description="پس از ثبت خرید، وضعیت سفارش شما در همین صفحه قابل پیگیری است."
          icon={<Bag2 size={28} />}
          action={
            <Button asChild className="bg-brand-primary">
              <Link href="/products">مشاهده محصولات</Link>
            </Button>
          }
        />
      ) : (
        <div
          className={cn(
            "space-y-4 transition-opacity",
            ordersQuery.isPlaceholderData && "pointer-events-none opacity-60",
          )}
        >
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
          {data && data.page_count > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                disabled={!data.has_previous || ordersQuery.isPlaceholderData}
                onClick={() => setPage((current) => Math.max(current - 1, 1))}
              >
                صفحه قبل
              </Button>
              <span className="text-sm text-gray-600">
                صفحه {data.current_page.toLocaleString("fa-IR")} از{" "}
                {data.page_count.toLocaleString("fa-IR")}
              </span>
              <Button
                variant="outline"
                disabled={!data.has_next || ordersQuery.isPlaceholderData}
                onClick={() => setPage((current) => current + 1)}
              >
                صفحه بعد
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
