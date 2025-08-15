"use client";
import { Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import { SearchNormal1 } from "iconsax-reactjs";
import { useState } from "react";

export default function SearchBar() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <>
      <div
        className={cn("relative z-20 h-12 w-full lg:max-w-[600px] flex-1 bg-[#fff]", {
          "rounded-t-md": isFocused,
        })}
      >
        <Input
          placeholder="جستجو"
          className={cn("-2 size-full", {
            "border-brand-primary border-0 border-b-2": isFocused,
          })}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
        />
        <SearchNormal1
          size="24"
          className="absolute top-1/2 left-3 -translate-y-1/2 cursor-pointer"
        />
        {isFocused ? (
          <div className="z-20 flex w-full items-center gap-14 rounded-b-md bg-[#fff] p-8">
            <div>
              <p className="mb-6 text-xl font-medium">بیشترین موارد جستجو شده</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-base text-gray-700 *:cursor-pointer">
                <p>مک بوک پرو</p>
                <p>اسپیکر های jbl</p>
                <p>ایرپاد پرو</p>
                <p>دوربین dslr</p>
                <p>سامسونگ A55</p>
                <p>اپل ویژن پرو</p>
                <p>تبلت</p>
                <p>لپتاپ ایسوس</p>
                <p>شیائومی</p>
                <p>شارژر فست</p>
              </div>
            </div>
            <div className="hidden lg:block">
              <p className="mb-6 text-xl font-medium">اخرین جستجو های شما</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-base text-gray-700 *:cursor-pointer">
                <p>لپتاپ</p>
                <p>قاب محافظ گوشی</p>
                <p>تبلت</p>
                <p>کابل شارژر</p>
                <p>هدفون</p>
                <p>مانیتور گیمینگ</p>
                <p>گوشی هوشمند</p>
                <p>پایه مانیتور</p>
                <p>ساعت هوشمند</p>
                <p>نگهدارنده کابل</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      {isFocused && (
        <div className="fixed inset-0 z-10 h-screen w-screen bg-black/50"></div>
      )}
    </>
  );
}
