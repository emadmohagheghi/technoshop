"use client";

import { Input } from "@/app/_components/ui/input";
import { cn } from "@/lib/utils";
import { SearchNormal1 } from "iconsax-reactjs";
import { useState } from "react";
import { useRouter } from "next/navigation";

const mostSearched = [
  "مک بوک پرو",
  "اسپیکر های jbl",
  "ایرپاد پرو",
  "دوربین dslr",
  "سامسونگ A55",
  "اپل ویژن پرو",
  "تبلت",
  "لپتاپ ایسوس",
  "شیائومی",
  "شارژر فست",
];

const lastSearched = [
  "لپتاپ",
  "قاب محافظ گوشی",
  "تبلت",
  "کابل شارژر",
  "هدفون",
  "مانیتور گیمینگ",
  "گوشی هوشمند",
  "پایه مانیتور",
  "ساعت هوشمند",
  "نگهدارنده کابل",
];

export default function SearchBar() {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");
  const router = useRouter();

  const handleSearch = (e?: React.KeyboardEvent<HTMLInputElement>) => {
    if (!value) return;
    if (e && e.key !== "Enter") return;
    router.push("/products?q=" + encodeURIComponent(value));
    setValue("");
    setIsFocused(false);
  };

  return (
    <>
      <div
        className={cn(
          "group relative z-20 h-12 w-full flex-1 rounded-md bg-white lg:max-w-[600px]",
          { "rounded-b-none": isFocused },
        )}
        onFocus={() => setIsFocused(true)}
      >
        <span
          className={cn(
            "absolute top-1/2 right-18 -translate-y-1/2 text-gray-700 group-focus-within:hidden",
            { "opacity-0": isFocused || value },
          )}
        >
          <span className="lg:hidden">در</span>
          <span className="text-brand-primary font-bold lg:hidden">
            تکنوشاپ...
          </span>
        </span>
        <Input
          placeholder="جستجو"
          className={cn(
            "size-full pr-5 focus:placeholder:opacity-0 md:text-base",
            {
              "border-brand-primary border-0 border-b-2 placeholder:opacity-0":
                isFocused || value,
            },
          )}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleSearch}
        />
        <SearchNormal1
          size="24"
          className={cn(
            "absolute top-1/2 left-3 -translate-y-1/2 cursor-pointer text-gray-400 transition-colors",
            { "text-brand-primary": isFocused },
          )}
          onClick={() => handleSearch()}
        />

        {/* Dynamic content shown on focus */}
        {isFocused && (
          <div className="absolute top-full left-0 z-20 flex w-full items-center gap-14 rounded-b-md bg-white p-8 shadow-lg">
            <div>
              <p className="mb-6 text-xl font-medium">
                بیشترین موارد جستجو شده
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-base text-gray-700 *:cursor-pointer">
                {mostSearched.map((term, index) => (
                  <p key={index}>{term}</p>
                ))}
              </div>
            </div>
            <div className="hidden lg:block">
              <p className="mb-6 text-xl font-medium">اخرین جستجو های شما</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-base text-gray-700 *:cursor-pointer">
                {lastSearched.map((term, index) => (
                  <p key={index}>{term}</p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay to close search bar */}
      {isFocused && (
        <div
          className="fixed inset-0 z-10 h-screen w-screen bg-black/50"
          onClick={() => setIsFocused(false)}
        ></div>
      )}
    </>
  );
}
