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
import { useHeaderStore } from "@/stores/header-data.store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";

const desktopNavItems = [
  { label: "همه محصولات", href: "/products" },
  { label: "فروش ویژه", href: "/products?special=true" },
  { label: "جدیدترین‌ها", href: "/products?sort=1" },
  { label: "پرفروش‌ترین‌ها", href: "/products?sort=2" },
];

export default function Navbar() {
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const status = useUserStore((state) => state.status);
  const pathname = usePathname();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const categories = useHeaderStore((state) => state.categories);

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

  return (
    <>
      <div
        className={cn(
          "fixed top-[103px] left-0 z-20 hidden w-full bg-[#fff] shadow duration-300 lg:block",
          !isScrollingUp && "-translate-y-18",
        )}
      >
        <nav className="mx-auto max-w-[1440px] px-6 py-5">
          <ul className="flex items-center gap-8 text-sm font-medium text-gray-700">
            <li>
              <DropdownMenu dir="rtl">
                <DropdownMenuTrigger className="hover:text-brand-primary data-[state=open]:text-brand-primary flex cursor-pointer items-center gap-1 transition-colors outline-none">
                  دسته‌بندی کالاها
                  <ArrowDown2 size="18" aria-hidden="true" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="max-h-96 min-w-64 bg-white p-2"
                >
                  <DropdownMenuLabel>دسته‌بندی محصولات</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/products" className="w-full py-2">
                      همه دسته‌بندی‌ها
                    </Link>
                  </DropdownMenuItem>
                  {categories.map((category) => (
                    <DropdownMenuItem key={category.id} asChild>
                      <Link
                        href={`/products?category=${category.slug}`}
                        className="w-full py-2"
                      >
                        {category.title_ir}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
            {desktopNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "hover:text-brand-primary transition-colors",
                    pathname === "/products" &&
                      item.href === "/products" &&
                      "text-brand-primary",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
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
                href="/products"
              >
                <Category
                  size="30"
                  color={
                    pathname.startsWith("/products")
                      ? "var(--color-primary)"
                      : "gray"
                  }
                />
                <p
                  className={cn({
                    "text-brand-primary": pathname.startsWith("/products"),
                  })}
                >
                  محصولات
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
