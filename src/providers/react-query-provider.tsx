"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient as QC } from "@/lib/react-query";
import React, { useState } from "react";

export default function QueryProvider({ children }: React.PropsWithChildren) {
  const [queryClient] = useState(() => QC);
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
