"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Header onMenuClick={() => setMobileOpen(true)} />
        <Box
          component="main"
          sx={{
            p: { xs: 2, sm: 3, lg: 4 },
            maxWidth: 1800,
            mx: "auto",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
