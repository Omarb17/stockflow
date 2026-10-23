
import api from "@/app/lib/api";

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string | null;
  categoryId: string;
  categoryName: string;
  unit: string;
  costPrice: number;
  reorderLevel: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  active: boolean;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface ProductRequest {
  name: string;
  sku: string;
  description: string;
  categoryId: string;
  unit: string;
  costPrice: number;
  reorderLevel: number;
}

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  active?: boolean;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: string;
}

export async function getProducts(
  filters: ProductFilters = {},
): Promise<PageResponse<Product>> {
  const response = await api.get<PageResponse<Product>>("/products", {
    params: {
      page: filters.page ?? 0,
      size: filters.size ?? 10,
      sortBy: filters.sortBy ?? "name",
      sortDirection: filters.sortDirection ?? "asc",
      ...(filters.search ? { search: filters.search } : {}),
      ...(filters.categoryId
        ? { categoryId: filters.categoryId }
        : {}),
      ...(filters.active !== undefined
        ? { active: filters.active }
        : {}),
    },
  });

  return response.data;
}

export async function getCategories(): Promise<Category[]> {
  const response = await api.get<PageResponse<Category>>("/categories", {
    params: {
      page: 0,
      size: 100,
      active: true,
      sortBy: "name",
      sortDirection: "asc",
    },
  });

  return response.data.content;
}

export async function createProduct(
  data: ProductRequest,
): Promise<Product> {
  const response = await api.post<Product>("/products", data);
  return response.data;
}

export async function updateProduct(
  id: string,
  data: ProductRequest,
): Promise<Product> {
  const response = await api.put<Product>(`/products/${id}`, data);
  return response.data;
}

export async function archiveProduct(id: string): Promise<void> {
  await api.patch(`/products/${id}/archive`);
}
