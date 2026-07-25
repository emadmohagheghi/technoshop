"use client";

import { Button } from "@/app/_components/ui/button";
import { prefetchProfileRouteData } from "@/lib/profile-queries";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores/user.store";
import {
  Heart,
  History,
  LayoutDashboard,
  LogOut,
  MapPin,
  Package,
  Settings,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

const navItems = [
  { href: "/profile", label: "پیشخوان", icon: LayoutDashboard, exact: true },
  { href: "/profile/orders", label: "سفارش‌ها", icon: Package },
  { href: "/profile/favorites", label: "علاقه‌مندی‌ها", icon: Heart },
  { href: "/profile/recent", label: "بازدیدهای اخیر", icon: History },
  { href: "/profile/account", label: "اطلاعات فردی", icon: UserRound },
  { href: "/profile/addresses", label: "آدرس‌ها", icon: MapPin },
  { href: "/profile/settings", label: "تنظیمات و امنیت", icon: Settings },
];

function isItemActive(pathname: string, href: string, exact?: boolean) {
  return exact ? pathname === href : pathname.startsWith(href);
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, status, logout } = useUserStore();
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const prefetchProfileItem = useCallback(
    (href: string) => {
      router.prefetch(href);
      void prefetchProfileRouteData(queryClient, href);
    },
    [queryClient, router],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      navItems.forEach((item) => router.prefetch(item.href));
    }, 150);

    return () => window.clearTimeout(timeoutId);
  }, [router]);

  const currentItem =
    navItems.find((item) => isItemActive(pathname, item.href, item.exact)) ??
    navItems[0];

  const handleLogout = async () => {
    await logout();
    toast.success("با موفقیت از حساب خارج شدید");
    router.replace("/");
  };

  return (
    <div dir="rtl" className="min-h-[calc(100vh-175px)] bg-gray-100">
      <div className="container px-3 py-4 sm:py-6">
        <div className="mb-3 rounded-xl border bg-white p-4 lg:hidden">
          <p className="text-xs text-gray-500">حساب کاربری</p>
          <p className="mt-1 font-semibold text-gray-900">
            {status === "loading"
              ? "در حال دریافت اطلاعات..."
              : user?.full_name || user?.phone}
          </p>
          <label htmlFor="profile-mobile-nav" className="sr-only">
            انتخاب بخش حساب کاربری
          </label>
          <select
            id="profile-mobile-nav"
            value={currentItem.href}
            onChange={(event) => {
              const href = event.target.value;
              prefetchProfileItem(href);
              router.push(href);
            }}
            className="focus:border-brand-primary mt-3 h-11 w-full rounded-lg border bg-white px-3 text-sm outline-none"
          >
            {navItems.map((item) => (
              <option key={item.href} value={item.href}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-start gap-5">
          <aside className="sticky top-48 hidden w-72 shrink-0 overflow-hidden rounded-xl border bg-white lg:block">
            <div className="border-b p-5">
              <div className="bg-brand-primary-content text-brand-primary grid size-14 place-items-center rounded-full">
                <UserRound className="size-6" />
              </div>
              <p className="mt-3 font-bold text-gray-900">
                {status === "loading"
                  ? "در حال بارگذاری..."
                  : user?.full_name || "کاربر تکنوشاپ"}
              </p>
              <p className="mt-1 text-sm text-gray-500">{user?.phone}</p>
            </div>

            <nav className="space-y-1 p-3" aria-label="حساب کاربری">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isItemActive(pathname, item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onMouseEnter={() => prefetchProfileItem(item.href)}
                    onFocus={() => prefetchProfileItem(item.href)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100",
                      active &&
                        "bg-brand-primary-content text-brand-primary hover:bg-brand-primary-content",
                    )}
                  >
                    <Icon className="size-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t p-3">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => void handleLogout()}
              >
                <LogOut className="size-5" />
                خروج از حساب
              </Button>
            </div>
          </aside>

          <div className="min-w-0 flex-1 pb-20 lg:pb-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
