"use client";
import { Provider as StateProvider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import store from "@/store";

export default function Provider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <StateProvider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </StateProvider>
  );
}
