"use client";
import { User, UserEdit, Bag, Setting } from "iconsax-reactjs";
import { useUserStore } from "@/stores/user.store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useRef, useEffect, useState } from "react";

const navItems = [
  {
    href: "/profile/account",
    icon: UserEdit,
    label: "اطلاعات فردی",
  },
  {
    href: "/profile/orders",
    icon: Bag,
    label: "سفارشات",
  },
  {
    href: "/profile/settings",
    icon: Setting,
    label: "تنظیمات",
  },
];

function Sidebar() {
  const { user } = useUserStore();
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const updateIndicator = () => {
      const activeIndex = navItems.findIndex((item) => item.href === pathname);
      const activeLink = linksRef.current[activeIndex];
      const indicator = indicatorRef.current;
      const nav = navRef.current;

      if (activeLink && indicator && nav) {
        const linkRect = activeLink.getBoundingClientRect();
        const navRect = nav.getBoundingClientRect();

        indicator.style.transform = `translate(${linkRect.left - navRect.left}px, ${linkRect.top - navRect.top}px)`;
        indicator.style.width = `${linkRect.width}px`;
        indicator.style.height = `${linkRect.height}px`;
        indicator.style.opacity = "1";
      }
    };

    updateIndicator();

    const resizeObserver = new ResizeObserver(updateIndicator);
    if (navRef.current) {
      resizeObserver.observe(navRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [pathname, mounted]);

  return (
    <div className="w-full lg:w-92">
      <nav
        ref={navRef}
        className="relative flex w-full flex-row flex-wrap gap-2 rounded-lg bg-white p-2 lg:flex-col"
      >
        {/* Sliding Indicator */}
        <div
          ref={indicatorRef}
          className="bg-brand-primary-content absolute top-0 left-0 rounded-lg transition-all duration-300 ease-in-out"
          style={{ width: 0, height: 0, opacity: 0 }}
        />

        {/* User Info */}
        <div className="text-brand-primary border-brand-primary relative z-10 flex w-full basis-full items-center gap-2 rounded-md border border-b-4 px-2 py-4 lg:basis-auto">
          <div className="grid size-16 place-content-center rounded-full bg-gray-200">
            <User className="size-6" />
          </div>
          <span className="text-xl font-medium">
            {user?.phone || (
              <div className="h-7 w-32 animate-pulse rounded-full bg-gray-300" />
            )}
          </span>
        </div>

        {/* Nav Links */}
        {navItems.map((item, index) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              ref={(el) => {
                linksRef.current[index] = el;
              }}
              href={item.href}
              className={cn(
                "relative z-10 flex h-fit items-center justify-start gap-1.5 rounded-lg px-2 py-5.5 text-xl font-medium lg:w-full",
                isActive && "text-brand-primary",
              )}
            >
              <Icon className="hidden size-6 lg:block" />
              <p className="text-base lg:text-lg">{item.label}</p>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="container px-3 py-5">
        <div
          dir="rtl"
          className="flex min-h-[calc(100vh-215px)] flex-col gap-2 lg:flex-row"
        >
          <Sidebar />
          <div className="min-h-[calc(100vh-401px)] w-full rounded-lg bg-white">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
