import Image from "next/image";
import { Button } from "../ui/button";
import { ShoppingCart, LoginCurve } from "iconsax-reactjs";
import Navbar from "./navbar";
import SearchBar from "./search-bar";

export default function Header() {
  return (
    <>
      {/* desktop */}
      <header className="hidden lg:block">
        <div className="fixed top-0 right-0 left-0 z-30 bg-[#fff]">
          <div className="mx-auto max-w-[1440px]">
            <div className="flex w-full items-center justify-between gap-4 p-5">
              <div className="h-[63px] w-[156px]">
                <Image
                  src="/images/logo.svg"
                  alt="Logo"
                  width={156}
                  height={63}
                />
              </div>
              <SearchBar />
              <div className="flex items-center">
                <Button
                  size="lg"
                  className="bg-brand-primary hover:bg-brand-primary-focus text-base"
                >
                  <LoginCurve size="24" />
                  ورود / ثبت نام
                </Button>
                <span className="mx-4 h-[40px] w-0.25 bg-gray-600"></span>
                <ShoppingCart size="32" />
              </div>
            </div>
          </div>
        </div>
        <Navbar />
      </header>
      {/* mobile */}
      <header className="block lg:hidden">
        <div className="fixed right-0 left-0 p-3 z-20 bg-[#fff]">
          <div className="relative h-12 flex-1 rounded-md border">
            <SearchBar />
            <span className="text-brand-primary pointer-events-none absolute top-1/2 right-16 z-20 -translate-y-1/2 text-base font-bold peer-focus:hidden">
              <span className="text-gray-">در</span>
              تکنوشاپ...
            </span>
          </div>
        </div>
        <Navbar />
      </header>
    </>
  );
}
