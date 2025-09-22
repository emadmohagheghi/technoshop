"use client";
import { TabsContent } from "@/app/_components/ui/tabs";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const params = useParams();
  const currentTab = (params?.slug as string) || "account";

  if (!["account", "orders", "settings"].includes(currentTab)) {
    notFound();
  }

  return (
    <>
      <TabsContent
        dir="ltr"
        value="account"
        className={cn(
          { hidden: currentTab !== "account" },
          "flex items-center justify-center",
        )}
      >
        <p>Account settings go here.</p>
      </TabsContent>
      <TabsContent
        dir="ltr"
        value="orders"
        className={cn(
          { hidden: currentTab !== "orders" },
          "flex items-center justify-center",
        )}
      >
        <p>Under construction...</p>
      </TabsContent>
      <TabsContent
        dir="ltr"
        value="settings"
        className={cn(
          { hidden: currentTab !== "settings" },
          "flex items-center justify-center",
        )}
      >
        <p>Under construction...</p>
      </TabsContent>
    </>
  );
}
