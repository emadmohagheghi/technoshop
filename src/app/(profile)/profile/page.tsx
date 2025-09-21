"use client";

import { useUserStore } from "@/stores/user.store";

export default function ProfilePage() {
  const { user } = useUserStore();

  console.log(user);

  return (
    <div className="grid min-h-[calc(100vh-62px)] place-items-center lg:min-h-[calc(100vh-175px)]">
      <p dir="ltr" className="text-2xl font-medium">Under construction...</p>
    </div>
  );
}
