import { Suspense } from "react";
import { SortOptions, ProductsGrid, Filters } from "./_components";
import SpinnerLoading from "../_components/ui/spinner-loading";

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
