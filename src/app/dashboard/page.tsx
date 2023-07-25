"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Dashboard } from "~/modules/dashboard";

const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}
