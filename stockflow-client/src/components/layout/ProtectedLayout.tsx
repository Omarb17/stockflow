"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { isAuthenticated } from "@/app/lib/auth";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    setAuthorized(true);
  }, [router]);

  if (!authorized) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
