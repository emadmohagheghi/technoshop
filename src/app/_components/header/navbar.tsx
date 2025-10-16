"use client";

import { cn } from "@/lib/utils";
import {
  ArrowDown2,
  Home,
  Category,
  User,
  ShoppingCart,
} from "iconsax-reactjs";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useUserStore } from "@/stores/user.store";
import SpinnerLoading from "../ui/spinner-loading";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/stores/cart.store";
import { Badge } from "@/app/_components/ui/badge";

export default function Navbar() {
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const status = useUserStore((state) => state.status);
  const pathname = usePathname();
  const totalItems = useCartStore((state) => state.getTotalItems());

  const handleScroll = useCallback(() => {
    if (window.scrollY < lastScrollY) {
      setIsScrollingUp(true);
    } else {
      setIsScrollingUp(false);
    }
    setLastScrollY(window.scrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY, handleScroll]);

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  return (
    <>
      <div
        className={cn(
          "fixed top-[103px] left-0 z-20 hidden w-full bg-[#fff] shadow duration-300 lg:block",
          !isScrollingUp && "-translate-y-18",
        )}
      >
        <nav className="mx-auto max-w-[1440px] p-6">
          <ul className="flex max-w-[625px] items-center justify-between">
            <li className="flex gap-1">
              دسته بندی کالا ها <ArrowDown2 size="24" />
            </li>
            <li>تخفیف</li>
            <li>پیشنهادات</li>
            <li>خرید اقساطی</li>
            <li>راهنمای خرید</li>
          </ul>
        </nav>
      </div>
      {/* mobile */}
      <div
        className={cn(
          "fixed right-0 bottom-0 left-0 z-10 duration-300 lg:hidden",
          !isScrollingUp && "translate-y-[90px]",
        )}
      >
        <nav className="z-20 mx-auto bg-[#fff] p-2.5">
          <ul className="flex w-full items-center justify-around text-sm text-gray-600">
            {/* home */}
            <li className="">
              <Link
                className="flex flex-col items-center justify-center"
                href="/"
              >
                <Home
                  size="30"
                  color={pathname === "/" ? "var(--color-primary)" : "gray"}
                />
                <p className={cn({ "text-brand-primary": pathname === "/" })}>
                  خانه
                </p>
              </Link>
            </li>
            {/* categories */}
            <li className="">
              <Link
                className="flex flex-col items-center justify-center"
                href="/categories"
              >
                <Category
                  size="30"
                  color={
                    pathname === "/categories" ? "var(--color-primary)" : "gray"
                  }
                />
                <p
                  className={cn({
                    "text-brand-primary": pathname === "/categories",
                  })}
                >
                  دسته بندی
                </p>
              </Link>
            </li>
            {/* cart */}
            <li>
              <Link
                href="/checkout/cart"
                className="flex flex-col items-center justify-center"
              >
                <div className="relative">
                  <ShoppingCart
                    size="30"
                    color={
                      pathname.startsWith("/checkout")
                        ? "var(--color-primary)"
                        : "gray"
                    }
                  />
                  {totalItems > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full p-0 text-xs"
                    >
                      {totalItems}
                    </Badge>
                  )}
                </div>
                <p
                  className={cn({
                    "text-brand-primary": pathname.startsWith("/checkout"),
                  })}
                >
                  سبد خرید
                </p>
              </Link>
            </li>
            {/* profile */}
            <li className="">
              {status === "loading" ? (
                <SpinnerLoading className="size-6" />
              ) : status === "authenticated" ? (
                <Link
                  className="flex flex-col items-center justify-center"
                  href="/profile"
                >
                  <User
                    size="30"
                    color={
                      pathname === "/profile" ? "var(--color-primary)" : "gray"
                    }
                  />
                  <p
                    className={cn({
                      "text-brand-primary": pathname === "/profile",
                    })}
                  >
                    پروفایل
                  </p>
                </Link>
              ) : (
                <Link
                  className="flex flex-col items-center justify-center"
                  href="/auth/login"
                >
                  <User
                    size="30"
                    color={
                      pathname.startsWith("/auth")
                        ? "var(--color-primary)"
                        : "gray"
                    }
                  />
                  <p
                    className={cn({
                      "text-brand-primary": pathname.startsWith("/auth"),
                    })}
                  >
                    ورود
                  </p>
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
