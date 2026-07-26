"use client";

import { Input } from "@/app/_components/ui/input";
import { cn } from "@/lib/utils";
import { createSearchHistory } from "@/services/users-service";
import { useUserStore } from "@/stores/user.store";
import { SearchNormal1 } from "iconsax-reactjs";
import { FormEvent, KeyboardEvent, useState } from "react";
import { useRouter } from "next/navigation";

const mostSearched = [
  "مک بوک پرو",
  "اسپیکرهای JBL",
  "ایرپاد پرو",
  "دوربین DSLR",
  "سامسونگ A55",
  "اپل ویژن پرو",
  "تبلت",
  "لپ‌تاپ ایسوس",
  "شیائومی",
  "شارژر فست",
];

export default function SearchBar() {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const status = useUserStore((state) => state.status);
  const recordSearchHistory = useUserStore(
    (state) => state.recordSearchHistory,
  );
  const recentSearches = user?.search_histories ?? [];

  const closeSearch = () => {
    setIsFocused(false);
  };

  const handleSearch = (term = value) => {
    const query = term.trim();
    if (!query) return;

    if (status === "authenticated") {
      void createSearchHistory(query)
        .then((response) => {
          if (response.success && response.data) {
            recordSearchHistory(response.data);
          }
        })
        .catch(() => {
          // Search must remain available even when history cannot be saved.
        });
    }

    router.push(`/products?q=${encodeURIComponent(query)}`);
    setValue("");
    closeSearch();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSearch();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      closeSearch();
      event.currentTarget.blur();
    }
  };

  return (
    <>
      <form
        className={cn(
          "group relative z-20 h-12 w-full flex-1 rounded-md bg-white lg:max-w-[600px]",
          { "rounded-b-none": isFocused },
        )}
        onFocus={() => setIsFocused(true)}
        onSubmit={handleSubmit}
        role="search"
      >
        <label htmlFor="site-search" className="sr-only">
          جست‌وجوی محصولات
        </label>
        <Input
          id="site-search"
          placeholder="جست‌وجوی محصول، برند یا دسته‌بندی"
          className={cn(
            "size-full pr-5 pl-12 focus:placeholder:opacity-0 md:text-base",
            {
              "border-brand-primary border-0 border-b-2 placeholder:opacity-0":
                isFocused || value,
            },
          )}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          enterKeyHint="search"
        />
        <button
          type="submit"
          className="hover:text-brand-primary focus-visible:outline-brand-primary absolute top-1/2 left-2 grid size-9 -translate-y-1/2 place-items-center rounded-md text-gray-400 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          aria-label="جست‌وجو"
        >
          <SearchNormal1
            size="24"
            className={cn({ "text-brand-primary": isFocused })}
            aria-hidden="true"
          />
        </button>

        {isFocused && (
          <div
            className="absolute top-full left-0 z-20 max-h-[calc(100dvh-72px)] w-full overflow-y-auto rounded-b-md bg-white p-4 shadow-lg sm:p-6 lg:max-h-none lg:p-8"
            role="dialog"
            aria-label="پیشنهادهای جست‌وجو"
          >
            <div className="grid gap-7 lg:grid-cols-2 lg:gap-14">
              <section aria-labelledby="popular-searches-title">
                <p
                  id="popular-searches-title"
                  className="mb-4 text-base font-medium lg:mb-6 lg:text-xl"
                >
                  بیشترین جست‌وجوها
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700 lg:gap-x-6 lg:gap-y-3 lg:text-base">
                  {mostSearched.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => handleSearch(term)}
                      className="hover:text-brand-primary focus-visible:text-brand-primary truncate text-right transition-colors focus-visible:outline-none"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </section>

              {status === "authenticated" && recentSearches.length > 0 && (
                <section aria-labelledby="recent-searches-title">
                  <p
                    id="recent-searches-title"
                    className="mb-4 text-base font-medium lg:mb-6 lg:text-xl"
                  >
                    آخرین جست‌وجوهای شما
                  </p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700 lg:gap-x-6 lg:gap-y-3 lg:text-base">
                    {recentSearches.map((history) => (
                      <button
                        key={history.id}
                        type="button"
                        onClick={() => handleSearch(history.search)}
                        className="hover:text-brand-primary focus-visible:text-brand-primary truncate text-right transition-colors focus-visible:outline-none"
                      >
                        {history.search}
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        )}
      </form>

      {isFocused && (
        <button
          type="button"
          className="fixed inset-0 z-10 h-screen w-screen cursor-default bg-black/50"
          onClick={closeSearch}
          aria-label="بستن پیشنهادهای جست‌وجو"
        />
      )}
    </>
  );
}
