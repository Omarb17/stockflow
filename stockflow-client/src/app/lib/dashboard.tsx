import api from "@/app/lib/api";

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  categoryName?: string;
  active: boolean;
  reorderLevel: number;
}

export interface StockRecord {
  id: string;
  productName?: string;
  warehouseName?: string;
  quantity: number;
}

export async function getProducts(): Promise<PageResponse<Product>> {
  const response = await api.get("/products", {
    params: { page: 0, size: 100 },
  });
  return response.data;
}

export async function getCategories(): Promise<PageResponse<unknown>> {
  const response = await api.get("/categories", {
    params: { page: 0, size: 1 },
  });
  return response.data;
}

export async function getWarehouses(): Promise<PageResponse<unknown>> {
  const response = await api.get("/warehouses", {
    params: { page: 0, size: 1 },
  });
  return response.data;
}

export async function getLowStock(): Promise<PageResponse<StockRecord>> {
  const response = await api.get("/inventory/low-stock", {
    params: { page: 0, size: 10 },
  });
  return response.data;
}
