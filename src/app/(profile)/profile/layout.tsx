"use client";
import { Tabs, TabsList, TabsTrigger } from "@/app/_components/ui/tabs";
import { User, UserEdit, Bag, Setting } from "iconsax-reactjs";
import { useUserStore } from "@/stores/user.store";
import Link from "next/link";
import { useParams, useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";
import SpinnerLoading from "@/app/_components/ui/spinner-loading";

const TriggerList = [
  {
    value: "account",
    icon: <UserEdit className="hidden size-6 lg:block" />,
    label: "اطلاعات فردی",
  },
  {
    value: "orders",
    icon: <Bag className="hidden size-6 lg:block" />,
    label: "سفارشات",
  },
  {
    value: "settings",
    icon: <Setting className="hidden size-6 lg:block" />,
    label: "تنظیمات",
  },
];

function TabsListContent({
  startTransition,
}: {
  startTransition: (callback: () => void) => void;
}) {
  const { user } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleTabClick = (href: string) => {
    if (pathname !== href) {
      startTransition(() => {
        router.push(href);
      });
    }
  };

  return (
    <div className="w-full lg:w-92">
      <TabsList
        className="flex w-full flex-row flex-wrap *:h-fit *:justify-start *:py-5.5 *:!text-xl *:!font-medium lg:flex-col"
        containerColor="bg-white"
        indicatorColor="bg-brand-primary-content"
      >
        <TabsTrigger
          disabled
          value="user"
          className="text-brand-primary border-brand-primary flex w-full basis-full items-center gap-2 border-b-4 !py-4 text-center disabled:opacity-100 lg:basis-auto"
        >
          <div className="grid size-16 place-content-center rounded-full bg-gray-200">
            <User className="size-6" />
          </div>
          <span>
            {user?.phone || (
              <div className="h-7 w-32 animate-pulse rounded-full bg-gray-300" />
            )}
          </span>
        </TabsTrigger>
        {TriggerList.map((trigger) => (
          <TabsTrigger
            key={trigger.value}
            value={trigger.value}
            asChild
            className="lg:w-full lg:flex-1"
          >
            <Link
              onClick={() => handleTabClick(`/profile/${trigger.value}`)}
              href={`/profile/${trigger.value}`}
            >
              {trigger.icon}
              <p className="text-base lg:text-lg">{trigger.label}</p>
            </Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const [isPending, startTransition] = useTransition();
  return (
    <div>
      <div className="container px-3 py-5">
        <Tabs
          dir="rtl"
          className="min-h-[calc(100vh-215px)] lg:flex-row"
          defaultValue={params?.slug as string}
        >
          <TabsListContent startTransition={startTransition} />

          <div className="w-full rounded-lg bg-white min-h-[calc(100vh-401px)]">
            {isPending ? (
              <div className="flex min-h-[calc(100vh-401px)] lg:h-full w-full items-center justify-center rounded-lg bg-white">
                <SpinnerLoading className="size-10" />
              </div>
            ) : (
              children
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
}
