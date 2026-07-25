"use client";

import { Button } from "@/app/_components/ui/button";
import { profileOrdersQueryOptions } from "@/lib/profile-queries";
import { OrderSummary } from "@/types/order.types";
import { useQuery } from "@tanstack/react-query";
import { Bag2 } from "iconsax-reactjs";
import Link from "next/link";
import { useState } from "react";
import OrderCard from "../_components/order-card";
import ProfilePageHeader from "../_components/profile-page-header";
import {
  ProfileEmpty,
  ProfileError,
  ProfileLoading,
} from "../_components/profile-states";
import { cn } from "@/lib/utils";

type OrderTab = "all" | "current" | "delivered" | "canceled";

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderTab>("all");
  const ordersQuery = useQuery(profileOrdersQueryOptions());
  const data = ordersQuery.data;
  const tabOrders: Record<OrderTab, OrderSummary[]> = {
    all: data?.all_orders ?? [],
    current: data?.current_orders ?? [],
    delivered: data?.delivered_orders ?? [],
    canceled: data?.canceled_orders ?? [],
  };
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
              onClick={() => setActiveTab(tab.id)}
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
      ) : tabOrders[activeTab].length === 0 ? (
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
        <div className="space-y-4">
          {tabOrders[activeTab].map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
