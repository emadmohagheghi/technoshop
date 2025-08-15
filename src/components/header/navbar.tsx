"use client";

import { cn } from "@/lib/utils";
import {
  ArrowDown2,
  Home,
  Category,
  ShoppingCart,
  User,
} from "iconsax-reactjs";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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
          "fixed top-[103px] left-0 z-20 hidden w-full shadow duration-300 lg:block bg-[#fff]",
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
          "fixed right-0 bottom-0 left-0 duration-300 lg:hidden",
          !isScrollingUp && "translate-y-[90px]",
        )}
      >
        <nav className="mx-auto max-w-[1440px] bg-[#fff] p-4 z-20">
          <ul className="flex w-full items-center justify-between text-sm *:flex *:flex-1 *:flex-col *:items-center *:justify-center *:gap-1 text-gray-600">
            <li>
              <Home size="30" color="gray" />
              <p>خانه</p>
            </li>
            <li>
              <Category size="30" color="gray" />
              <p>دسته بندی</p>
            </li>
            <li>
              <ShoppingCart size="30" color="gray" />
              <p>سبد خرید</p>
            </li>
            <li>
              <User size="30" color="gray" />
              <p>ورود</p>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
