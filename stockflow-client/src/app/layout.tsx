import type { Metadata } from "next";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./globals.css";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "StockFlow | Inventory Management",
  description:
    "Manage products, warehouses, inventory, suppliers, and purchase orders with StockFlow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <Providers>{children}</Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
