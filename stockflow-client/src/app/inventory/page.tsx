"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  TextField,
  Typography,
} from "@mui/material";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { getProducts, type Product } from "@/app/lib/products";

import {
  adjustStock,
  getLowStock,
  getStock,
  getStockMovements,
  getWarehouses,
  issueStock,
  receiveStock,
  type StockRecord,
  type StockMovement,
  type Warehouse,
} from "@/app/lib/inventory";

type TabName = "stock" | "low-stock" | "movements";
type Operation = "receive" | "issue" | "adjust";

interface OperationForm {
  productId: string;
  warehouseId: string;
  quantity: string;
  reason: string;
}

const emptyForm: OperationForm = {
  productId: "",
  warehouseId: "",
  quantity: "",
  reason: "",
};

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

function getErrorMessage(error: unknown): string {
  const apiError = error as {
    response?: {
      data?: { message?: string };
    };
    message?: string;
  };

  return (
    apiError.response?.data?.message ||
    apiError.message ||
    "Something went wrong. Please try again."
  );
}

export default function InventoryPage() {
  const [tab, setTab] = useState<TabName>("stock");

  const [stock, setStock] = useState<StockRecord[]>([]);
  const [lowStock, setLowStock] = useState<StockRecord[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [warehouseFilter, setWarehouseFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [operation, setOperation] = useState<Operation>("receive");
  const [form, setForm] = useState<OperationForm>(emptyForm);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const results = await Promise.all([
        getStock(),
        getLowStock(),
        getStockMovements(),
        getWarehouses(),
        getProducts({
          page: 0,
          size: 100,
          sortBy: "name",
          sortDirection: "asc",
          active: true,
        }),
      ]);

      setStock(results[0].content);
      setLowStock(results[1].content);
      setMovements(results[2].content);
      setWarehouses(results[3].filter((w) => w.active));
      setProducts(results[4].content);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const filteredStock = useMemo(() => {
    if (warehouseFilter === "all") return stock;

    return stock.filter((item) => item.warehouseId === warehouseFilter);
  }, [stock, warehouseFilter]);

  const filteredLowStock = useMemo(() => {
    if (warehouseFilter === "all") return lowStock;

    return lowStock.filter((item) => item.warehouseId === warehouseFilter);
  }, [lowStock, warehouseFilter]);

  const filteredMovements = useMemo(() => {
    if (warehouseFilter === "all") return movements;

    return movements.filter((item) => item.warehouseId === warehouseFilter);
  }, [movements, warehouseFilter]);

  const reorderLevels = useMemo(
    () => new Map(products.map((p) => [p.id, p.reorderLevel])),
    [products],
  );

  const outOfStockCount = filteredStock.filter(
    (item) => Number(item.quantity) <= 0,
  ).length;

  const lowStockCount = filteredStock.filter((item) => {
    const threshold = reorderLevels.get(item.productId);

    return (
      threshold !== undefined &&
      Number(item.quantity) > 0 &&
      Number(item.quantity) <= threshold
    );
  }).length;

  function openOperation(nextOperation: Operation) {
    setOperation(nextOperation);
    setForm(emptyForm);
    setError("");
    setDialogOpen(true);
  }

  function closeDialog() {
    if (saving) return;

    setDialogOpen(false);
    setForm(emptyForm);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const quantity = Number(form.quantity);

    if (!form.productId || !form.warehouseId) {
      setError("Select a product and a warehouse.");
      return;
    }

    if (!Number.isFinite(quantity) || quantity < 0) {
      setError("Enter a valid quantity.");
      return;
    }

    if (operation !== "adjust" && quantity <= 0) {
      setError("The quantity must be greater than zero.");
      return;
    }

    if (operation === "adjust" && form.reason.trim().length < 3) {
      setError("Enter an adjustment reason of at least 3 characters.");
      return;
    }

    if (form.reason.length > 500) {
      setError("The reason cannot exceed 500 characters.");
      return;
    }

    setSaving(true);

    try {
      if (operation === "receive") {
        await receiveStock({
          productId: form.productId,
          warehouseId: form.warehouseId,
          quantity,
          reason: form.reason.trim() || undefined,
        });
      } else if (operation === "issue") {
        await issueStock({
          productId: form.productId,
          warehouseId: form.warehouseId,
          quantity,
          reason: form.reason.trim() || undefined,
        });
      } else {
        await adjustStock({
          productId: form.productId,
          warehouseId: form.warehouseId,
          newQuantity: quantity,
          reason: form.reason.trim(),
        });
      }

      setDialogOpen(false);
      setForm(emptyForm);

      setNotice(
        operation === "receive"
          ? "Stock received successfully."
          : operation === "issue"
            ? "Stock issued successfully."
            : "Stock adjusted successfully.",
      );

      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  const displayedStock = tab === "low-stock" ? filteredLowStock : filteredStock;

  const pageTitle =
    tab === "movements"
      ? "Stock movements"
      : tab === "low-stock"
        ? "Low stock"
        : "Inventory";

  return (
    <ProtectedLayout>
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1500, mx: "auto" }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Inventory
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Monitor stock levels and record inventory movements.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Button variant="outlined" onClick={() => openOperation("issue")}>
              Issue stock
            </Button>

            <Button variant="outlined" onClick={() => openOperation("adjust")}>
              Adjust stock
            </Button>

            <Button
              variant="contained"
              onClick={() => openOperation("receive")}
            >
              Receive stock
            </Button>
          </Stack>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
            <Typography color="text.secondary" variant="body2">
              Stock records
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {filteredStock.length}
            </Typography>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
            <Typography color="text.secondary" variant="body2">
              Low-stock items
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {lowStockCount}
            </Typography>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
            <Typography color="text.secondary" variant="body2">
              Out of stock
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {outOfStockCount}
            </Typography>
          </Paper>
        </Stack>

        <Paper variant="outlined">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
            spacing={2}
            sx={{ px: 2, pt: 1 }}
          >
            <Tabs
              value={tab}
              onChange={(_, value: TabName) => setTab(value)}
              variant="scrollable"
              allowScrollButtonsMobile
            >
              <Tab label="All stock" value="stock" />
              <Tab label="Low stock" value="low-stock" />
              <Tab label="Movement history" value="movements" />
            </Tabs>

            <TextField
              select
              size="small"
              label="Warehouse"
              value={warehouseFilter}
              onChange={(event) => setWarehouseFilter(event.target.value)}
              sx={{ minWidth: 200, m: 2 }}
            >
              <MenuItem value="all">All warehouses</MenuItem>
              {warehouses.map((warehouse) => (
                <MenuItem key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Box sx={{ px: 2, py: 2 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              {pageTitle}
            </Typography>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
                <CircularProgress />
              </Box>
            ) : tab === "movements" ? (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Product</TableCell>
                      <TableCell>Warehouse</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Change</TableCell>
                      <TableCell align="right">Before</TableCell>
                      <TableCell align="right">After</TableCell>
                      <TableCell>Reason</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {filteredMovements.map((movement) => (
                      <TableRow key={movement.id} hover>
                        <TableCell>{formatDate(movement.createdAt)}</TableCell>
                        <TableCell>
                          <Typography fontWeight={600}>
                            {movement.productName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {movement.sku}
                          </Typography>
                        </TableCell>
                        <TableCell>{movement.warehouseName}</TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={movement.type.replace("_", " ")}
                            color={
                              movement.type === "IN" ||
                              movement.type === "TRANSFER_IN"
                                ? "success"
                                : movement.type === "OUT" ||
                                    movement.type === "TRANSFER_OUT"
                                  ? "warning"
                                  : "default"
                            }
                          />
                        </TableCell>
                        <TableCell align="right">
                          {Number(movement.quantity).toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                          {Number(movement.quantityBefore).toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                          {Number(movement.quantityAfter).toLocaleString()}
                        </TableCell>
                        <TableCell>{movement.reason || "—"}</TableCell>
                      </TableRow>
                    ))}

                    {filteredMovements.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          No stock movements found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>SKU</TableCell>
                      <TableCell>Warehouse</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Reorder level</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Last updated</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {displayedStock.map((item) => {
                      const quantity = Number(item.quantity);
                      const reorderLevel = reorderLevels.get(item.productId);
                      const isOut = quantity <= 0;
                      const isLow =
                        reorderLevel !== undefined &&
                        quantity > 0 &&
                        quantity <= reorderLevel;

                      return (
                        <TableRow key={item.id} hover>
                          <TableCell>
                            <Typography fontWeight={600}>
                              {item.productName}
                            </Typography>
                          </TableCell>
                          <TableCell>{item.sku}</TableCell>
                          <TableCell>{item.warehouseName}</TableCell>
                          <TableCell align="right">
                            {quantity.toLocaleString()}
                          </TableCell>
                          <TableCell align="right">
                            {reorderLevel ?? "—"}
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={
                                isOut
                                  ? "Out of stock"
                                  : isLow
                                    ? "Low stock"
                                    : "In stock"
                              }
                              color={
                                isOut ? "error" : isLow ? "warning" : "success"
                              }
                            />
                          </TableCell>
                          <TableCell>{formatDate(item.updatedAt)}</TableCell>
                        </TableRow>
                      );
                    })}

                    {displayedStock.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          No inventory records found. Receive stock for a
                          product to create its first stock record.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
              <Button onClick={() => void loadData()} disabled={loading}>
                Refresh
              </Button>
            </Stack>
          </Box>
        </Paper>

        <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
          <Box component="form" onSubmit={handleSubmit}>
            <DialogTitle>
              {operation === "receive"
                ? "Receive stock"
                : operation === "issue"
                  ? "Issue stock"
                  : "Adjust stock"}
            </DialogTitle>

            <DialogContent>
              <Stack spacing={2} sx={{ pt: 1 }}>
                <TextField
                  select
                  required
                  label="Product"
                  value={form.productId}
                  onChange={(event) =>
                    setForm({ ...form, productId: event.target.value })
                  }
                >
                  {products.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name} ({product.sku})
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  required
                  label="Warehouse"
                  value={form.warehouseId}
                  onChange={(event) =>
                    setForm({ ...form, warehouseId: event.target.value })
                  }
                >
                  {warehouses.map((warehouse) => (
                    <MenuItem key={warehouse.id} value={warehouse.id}>
                      {warehouse.name} ({warehouse.code})
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  required
                  type="number"
                  label={
                    operation === "adjust" ? "New stock quantity" : "Quantity"
                  }
                  value={form.quantity}
                  onChange={(event) =>
                    setForm({ ...form, quantity: event.target.value })
                  }
                  slotProps={{
                    htmlInput: {
                      min: 0,
                      step: "0.001",
                    },
                  }}
                  helperText={
                    operation === "adjust"
                      ? "Enter the total quantity that should exist."
                      : "Enter the quantity to receive or issue."
                  }
                />

                <TextField
                  label="Reason"
                  value={form.reason}
                  required={operation === "adjust"}
                  multiline
                  minRows={2}
                  inputProps={{ maxLength: 500 }}
                  onChange={(event) =>
                    setForm({ ...form, reason: event.target.value })
                  }
                  placeholder={
                    operation === "receive"
                      ? "Supplier delivery, purchase..."
                      : operation === "issue"
                        ? "Sale, damaged goods..."
                        : "Physical inventory count..."
                  }
                />

                {operation === "issue" && (
                  <Alert severity="info">
                    The backend validates stock availability and should reject
                    an issue that would make stock negative.
                  </Alert>
                )}

                {error && <Alert severity="error">{error}</Alert>}
              </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={closeDialog} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>

        <Alert
          severity="success"
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            display: notice ? "flex" : "none",
            zIndex: 1500,
          }}
          onClose={() => setNotice("")}
        >
          {notice}
        </Alert>
      </Box>
    </ProtectedLayout>
  );
}
