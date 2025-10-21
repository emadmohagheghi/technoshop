import { Suspense } from "react";
import { SortOptions, ProductsGrid, Filters } from "./_components";
import SpinnerLoading from "@/app/_components/ui/spinner-loading";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "محصولات | تکنوشاپ",
  description:
    "مشاهده و خرید انواع محصولات دیجیتال شامل موبایل، لپ‌تاپ، تبلت و لوازم جانبی با بهترین قیمت و کیفیت در تکنوشاپ.",
  keywords: [
    "محصولات دیجیتال",
    "خرید موبایل",
    "خرید لپ‌تاپ",
    "لوازم جانبی",
    "تبلت",
    "تکنوشاپ",
  ],
  openGraph: {
    title: "محصولات | تکنوشاپ",
    description: "مشاهده و خرید انواع محصولات دیجیتال با بهترین قیمت",
    url: "https://technoshop.emadmo.ir/products",
    siteName: "تکنوشاپ",
    locale: "fa_IR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "محصولات | تکنوشاپ",
    description: "مشاهده و خرید انواع محصولات دیجیتال با بهترین قیمت",
  },
};

function ProductsContent() {
  return (
    <div className="container flex min-h-screen w-full flex-col gap-3 p-3 lg:flex-row">
      <div className="relative p-2 lg:block lg:w-1/4">
        <div className="flex w-full gap-4 lg:sticky lg:top-48">
          <div className="w-full flex-1">
            <Filters />
          </div>
          <div className="w-full flex-1 lg:hidden">
            <SortOptions />
          </div>
        </div>
      </div>
      <div className="w-full space-y-4 p-2 lg:w-3/4">
        <div className="hidden lg:block">
          <SortOptions />
        </div>
        <ProductsGrid />
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <div>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <SpinnerLoading />
          </div>
        }
      >
        <ProductsContent />
      </Suspense>
    </div>
  );
}
