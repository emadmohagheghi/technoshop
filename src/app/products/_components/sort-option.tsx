"use client";
import { useEffect, useRef } from "react";
import { Sort } from "iconsax-reactjs";
import { useProductsFilters } from "@/hooks/use-product-filter";
import { Button } from "@/app/_components/ui/button";
import { SORT_OPTIONS } from "@/types/filters.types";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
} from "@/app/_components/ui/drawer";

export default function SortOptions() {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const {
    filters: { sort },
    setters: { setSort },
  } = useProductsFilters();

  const activeIndex = SORT_OPTIONS.findIndex((opt) => opt.value === sort) ?? 0;
  const validatedIndex = activeIndex === -1 ? 0 : activeIndex;

  useEffect(() => {
    if (activeIndex === -1) {
      setSort("1");
    }
  }, [activeIndex]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updatePosition = () => {
      const btn = buttonsRef.current[validatedIndex];
      const bg = activeRef.current;

      if (btn && bg && container) {
        const btnRect = btn.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const offsetLeft = btnRect.left - containerRect.left;
        const width = btnRect.width;

        bg.style.transform = `translateX(${offsetLeft}px)`;
        bg.style.width = `${width}px`;
      }
    };
    updatePosition();

    const resizeObserver = new ResizeObserver(() => {
      updatePosition();
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [validatedIndex]);

  return (
    <>
      {/* dekstop */}
      <div
        ref={containerRef}
        className="relative hidden h-15 w-full gap-2 rounded-lg border border-gray-100 bg-[#fff] p-2 text-sm font-medium shadow lg:inline-flex"
      >
        <p className="my-auto flex items-center justify-center">
          <Sort color="black" size={24} />
          مرتب سازی بر اساس
        </p>
        <div
          ref={activeRef}
          className="bg-brand-primary-content absolute top-2 bottom-2 left-0 rounded-md transition-all duration-300 ease-in-out"
          style={{ width: 0 }}
        />
        {SORT_OPTIONS.map((option, index) => (
          <button
            key={"desktop-" + option.value}
            ref={(el) => {
              if (el) buttonsRef.current[index] = el;
            }}
            aria-pressed={validatedIndex === index}
            className={`relative z-10 cursor-pointer px-4 py-1 transition-colors duration-200 ${
              validatedIndex === index
                ? "text-brand-primary font-semibold"
                : "text-gray-500"
            }`}
            onClick={() => {
              if (index !== validatedIndex) {
                setSort(option.value);
              }
            }}
          >
            {option.text}
          </button>
        ))}
      </div>
      <Drawer>
        <DrawerTrigger asChild>
          <Button className="w-full flex-1 !rounded-full lg:hidden bg-brand-primary">
            مرتب سازی
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="space-y-4 p-4">
            <DrawerTitle>مرتب‌سازی بر اساس</DrawerTitle>
            {SORT_OPTIONS.map((option) => (
              <DrawerClose key={"mobile-" + option.value} asChild>
                <button
                  className={`w-full rounded-lg p-3 text-right transition-colors ${
                    sort === option.value
                      ? "bg-brand-primary-content text-brand-primary"
                      : "bg-gray-100 text-black"
                  }`}
                  onClick={() => {
                    setSort(option.value);
                  }}
                >
                  {option.text}
                </button>
              </DrawerClose>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
