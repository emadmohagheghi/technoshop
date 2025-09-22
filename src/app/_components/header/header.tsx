"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import Navbar from "./navbar";
import SearchBar from "./search-bar";
import CartBtn from "./cart-btn";
import Link from "next/link";
import { useUserStore } from "@/stores/user.store";
import { UserCircle } from "lucide-react";
import SpinnerLoading from "../ui/spinner-loading";

export default function Header() {
  const { user, status } = useUserStore();

  return (
    <>
      {/* desktop */}
      <header className="hidden lg:block">
        <div className="fixed top-0 right-0 left-0 z-30 bg-[#fff]">
          <div className="mx-auto max-w-[1440px]">
            <div className="flex w-full items-center justify-between gap-4 p-5">
              <div className="h-[63px] w-[156px]">
                <Link href="/">
                  <Image
                    src="/images/logo.svg"
                    alt="Logo"
                    width={156}
                    height={63}
                  />
                </Link>
              </div>
              <SearchBar />
              <div className="flex items-center">
                {status === "loading" ? (
                  <>
                    <Button size="icon" className="bg-brand-primary border">
                      <SpinnerLoading className="size-6" />
                    </Button>
                  </>
                ) : user ? (
                  <Link href="/profile/account">
                    <Button
                      size="lg"
                      className="bg-brand-primary hover:bg-brand-primary-focus cursor-pointer text-base"
                    >
                      <UserCircle size="24" />
                      پروفایل
                    </Button>
                  </Link>
                ) : (
                  <Link href="/auth/login">
                    <Button
                      size="lg"
                      className="bg-brand-primary hover:bg-brand-primary-focus cursor-pointer text-base"
                    >
                      <UserCircle size="24" />
                      ورود
                    </Button>
                  </Link>
                )}
                <span className="mx-4 h-[40px] w-0.25 bg-gray-600"></span>
                <CartBtn />
              </div>
            </div>
          </div>
        </div>
        <Navbar />
      </header>
      {/* mobile */}
      <header className="block lg:hidden">
        <div className="fixed right-0 left-0 z-20 bg-[#fff] p-3">
          <div className="relative h-12 flex-1 rounded-md border">
            <SearchBar />
          </div>
        </div>
        <Navbar />
      </header>
    </>
  );
}
