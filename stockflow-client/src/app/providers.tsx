"use client";

import { useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import theme from "@/theme";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  );
}
