"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
  Chip,
} from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import {
  getProducts,
  getCategories,
  getWarehouses,
  getLowStock,
} from "@/app/lib/dashboard";

export default function HomePage() {
  const products = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const warehouses = useQuery({
    queryKey: ["warehouses"],
    queryFn: getWarehouses,
  });

  const lowStock = useQuery({
    queryKey: ["low-stock"],
    queryFn: getLowStock,
  });

  const loading =
    products.isLoading ||
    categories.isLoading ||
    warehouses.isLoading ||
    lowStock.isLoading;

  const error =
    products.isError ||
    categories.isError ||
    warehouses.isError ||
    lowStock.isError;

  const stats = [
    {
      label: "Products",
      value: products.data?.totalElements ?? "—",
      icon: <Inventory2OutlinedIcon />,
      color: "#2563EB",
    },
    {
      label: "Categories",
      value: categories.data?.totalElements ?? "—",
      icon: <CategoryOutlinedIcon />,
      color: "#7C3AED",
    },
    {
      label: "Warehouses",
      value: warehouses.data?.totalElements ?? "—",
      icon: <WarehouseOutlinedIcon />,
      color: "#0891B2",
    },
    {
      label: "Low-stock items",
      value: lowStock.data?.totalElements ?? "—",
      icon: <WarningAmberOutlinedIcon />,
      color: "#DC2626",
    },
  ];

  return (
    <ProtectedLayout>
      <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#F6F8FC", minHeight: "100vh" }}>
        <Typography variant="h4" fontWeight={700}>
          Dashboard
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 1, mb: 4 }}>
          Overview of your inventory and warehouse operations.
        </Typography>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Could not load dashboard data. Check that the backend is running and
            you are signed in.
          </Alert>
        )}

        {!loading && !error && (
          <>
            <Grid container spacing={3}>
              {stats.map((stat) => (
                <Grid key={stat.label} size={{ xs: 12, sm: 6, lg: 3 }}>
                  <Card
                    elevation={0}
                    sx={{
                      border: "1px solid #E5E7EB",
                      borderRadius: 3,
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography color="text.secondary">
                          {stat.label}
                        </Typography>
                        <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                      </Box>

                      <Typography variant="h4" fontWeight={700} sx={{ mt: 2 }}>
                        {stat.value}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Card
              elevation={0}
              sx={{ mt: 4, border: "1px solid #E5E7EB", borderRadius: 3 }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  Low-stock items
                </Typography>

                {lowStock.data?.content.length ? (
                  lowStock.data.content.map((item, index) => (
                    <Box
                      key={item.id ?? index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                        py: 2,
                        borderBottom: "1px solid #F0F1F4",
                      }}
                    >
                      <Box>
                        <Typography fontWeight={600}>
                          {item.productName ?? "Product"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.warehouseName ?? "Warehouse"}
                        </Typography>
                      </Box>

                      <Chip
                        label={`Quantity: ${item.quantity}`}
                        color="warning"
                        size="small"
                      />
                    </Box>
                  ))
                ) : (
                  <Typography color="text.secondary">
                    No low-stock items found.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </Box>
    </ProtectedLayout>
  );
}
