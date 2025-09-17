"use client";

import { cn } from "@/lib/utils";
import { ArrowDown2, Home, Category, User } from "iconsax-reactjs";
import { useEffect, useState } from "react";
import CartBtn from "./cart-btn";
import Link from "next/link";
import { useUserStore } from "@/stores/user.store";
import SpinnerLoading from "../ui/spinner-loading";

export default function Navbar() {
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { status } = useUserStore();

  const handleScroll = () => {
    if (window.scrollY < lastScrollY) {
      setIsScrollingUp(true);
    } else {
      setIsScrollingUp(false);
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);
  return (
    <>
      {/* desktop */}
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
          "fixed right-0 bottom-0 left-0 z-20 duration-300 lg:hidden",
          !isScrollingUp && "translate-y-[90px]",
        )}
      >
        <nav className="z-20 mx-auto max-w-[1440px] bg-[#fff] p-4">
          <ul className="flex w-full items-center justify-between text-sm text-gray-600 *:flex *:flex-1 *:flex-col *:items-center *:justify-center *:gap-1">
            <li>
              <Link href="/">
                <Home size="30" color="gray" />
                <p>خانه</p>
              </Link>
            </li>
            <li>
              <Link href="/category">
                <Category size="30" color="gray" />
                <p>دسته بندی</p>
              </Link>
            </li>
            <li>
              <CartBtn />
              <p>سبد خرید</p>
            </li>
            <li>
              {status === "loading" ? (
                <SpinnerLoading className="size-6" />
              ) : status === "authenticated" ? (
                <Link href="/profile">
                  <User size="30" color="gray" />
                  <p>پروفایل</p>
                </Link>
              ) : (
                <Link href="/auth/login">
                  <User size="30" color="gray" />
                  <p>ورود</p>
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
