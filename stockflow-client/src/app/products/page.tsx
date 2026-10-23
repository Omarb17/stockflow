"use client";

import { useCallback, useEffect, useState } from "react";
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
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import {
  archiveProduct,
  createProduct,
  getCategories,
  getProducts,
  updateProduct,
  type Category,
  type Product,
  type ProductRequest,
} from "@/app/lib/products";

const emptyForm: ProductRequest = {
  name: "",
  sku: "",
  description: "",
  categoryId: "",
  unit: "piece",
  costPrice: 0,
  reorderLevel: 0,
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState("active");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductRequest>(emptyForm);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getProducts({
        page,
        size: 10,
        search: search.trim(),
        categoryId: categoryId || undefined,
        active: status === "all" ? undefined : status === "active",
      });

      setProducts(result.content);
      setTotal(result.totalElements);
    } catch {
      setError("Unable to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, search, categoryId, status]);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {
        setError("Unable to load categories.");
      });
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  function openCreateDialog() {
    setEditingProduct(null);
    setForm(emptyForm);
    setError("");
    setDialogOpen(true);
  }

  function openEditDialog(product: Product) {
    setEditingProduct(product);
    setForm({
      name: product.name,
      sku: product.sku,
      description: product.description ?? "",
      categoryId: product.categoryId,
      unit: product.unit,
      costPrice: product.costPrice,
      reorderLevel: product.reorderLevel,
    });
    setError("");
    setDialogOpen(true);
  }

  function updateField<K extends keyof ProductRequest>(
    field: K,
    value: ProductRequest[K],
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload: ProductRequest = {
        ...form,
        name: form.name.trim(),
        sku: form.sku.trim(),
        description: form.description.trim(),
        unit: form.unit.trim(),
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        setSuccess("Product updated successfully.");
      } else {
        await createProduct(payload);
        setSuccess("Product created successfully.");
      }

      setDialogOpen(false);
      await loadProducts();
    } catch {
      setError(
        "Unable to save the product. Check the fields and ensure the SKU is unique.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleArchive(product: Product) {
    const confirmed = window.confirm(`Archive "${product.name}"?`);

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await archiveProduct(product.id);
      setSuccess("Product archived successfully.");
      await loadProducts();
    } catch {
      setError("Unable to archive this product.");
    }
  }

  return (
    <ProtectedLayout>
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Products
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Manage your product catalog and reorder levels.
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={openCreateDialog}
            disabled={categories.length === 0}
          >
            Add product
          </Button>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{ mb: 2 }}
            onClose={() => setSuccess("")}
          >
            {success}
          </Alert>
        )}

        <Paper sx={{ p: 2, mb: 3 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="Search products"
              placeholder="Name or SKU"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(0);
              }}
              fullWidth
              size="small"
            />

            <TextField
              select
              label="Category"
              value={categoryId}
              onChange={(event) => {
                setCategoryId(event.target.value);
                setPage(0);
              }}
              size="small"
              sx={{ minWidth: { md: 200 } }}
            >
              <MenuItem value="">All categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Status"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(0);
              }}
              size="small"
              sx={{ minWidth: { md: 160 } }}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Archived</MenuItem>
              <MenuItem value="all">All products</MenuItem>
            </TextField>
          </Stack>
        </Paper>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell align="right">Cost price</TableCell>
                <TableCell align="right">Reorder level</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress size={28} sx={{ my: 3 }} />
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Box sx={{ py: 5 }}>
                      <Typography fontWeight={600}>
                        No products found
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        Try changing your filters or add a product.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <Typography fontWeight={600}>{product.name}</Typography>
                      {product.description && (
                        <Typography variant="caption" color="text.secondary">
                          {product.description}
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.categoryName}</TableCell>
                    <TableCell>{product.unit}</TableCell>

                    <TableCell align="right">
                      {Number(product.costPrice).toFixed(2)}
                    </TableCell>

                    <TableCell align="right">{product.reorderLevel}</TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={product.active ? "Active" : "Archived"}
                        color={product.active ? "success" : "default"}
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                      >
                        <Button
                          size="small"
                          onClick={() => openEditDialog(product)}
                          disabled={!product.active}
                        >
                          Edit
                        </Button>

                        {product.active && (
                          <Button
                            size="small"
                            color="error"
                            onClick={() => void handleArchive(product)}
                          >
                            Archive
                          </Button>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={total}
            page={page}
            rowsPerPage={10}
            rowsPerPageOptions={[10]}
            onPageChange={(_, newPage) => setPage(newPage)}
          />
        </TableContainer>

        <Dialog
          open={dialogOpen}
          onClose={() => !saving && setDialogOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <Box component="form" onSubmit={handleSubmit}>
            <DialogTitle>
              {editingProduct ? "Edit product" : "Create product"}
            </DialogTitle>

            <DialogContent>
              <Stack spacing={2} sx={{ pt: 1 }}>
                <TextField
                  label="Product name"
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  required
                  fullWidth
                />

                <TextField
                  label="SKU"
                  value={form.sku}
                  onChange={(event) => updateField("sku", event.target.value)}
                  required
                  fullWidth
                  helperText="Must be unique."
                />

                <TextField
                  select
                  label="Category"
                  value={form.categoryId}
                  onChange={(event) =>
                    updateField("categoryId", event.target.value)
                  }
                  required
                  fullWidth
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Description"
                  value={form.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  multiline
                  minRows={2}
                  fullWidth
                />

                <TextField
                  label="Unit"
                  value={form.unit}
                  onChange={(event) => updateField("unit", event.target.value)}
                  required
                  fullWidth
                  helperText="For example: piece, kg, box."
                />

                <TextField
                  label="Cost price"
                  type="number"
                  value={form.costPrice}
                  onChange={(event) =>
                    updateField("costPrice", Number(event.target.value))
                  }
                  slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
                  required
                  fullWidth
                />

                <TextField
                  label="Reorder level"
                  type="number"
                  value={form.reorderLevel}
                  onChange={(event) =>
                    updateField("reorderLevel", Number(event.target.value))
                  }
                  slotProps={{ htmlInput: { min: 0, step: 1 } }}
                  required
                  fullWidth
                />
              </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={() => setDialogOpen(false)} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={saving}>
                {saving
                  ? "Saving..."
                  : editingProduct
                    ? "Save changes"
                    : "Create product"}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Box>
    </ProtectedLayout>
  );
}
