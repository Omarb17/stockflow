
import api from "@/app/lib/api";

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  taxNumber: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierRequest {
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  taxNumber?: string;
}

export interface SupplierPage {
  content: Supplier[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface SupplierFilters {
  search?: string;
  active?: boolean;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

export async function getSuppliers(
  filters: SupplierFilters = {}
): Promise<SupplierPage> {
  const response = await api.get<SupplierPage>("/suppliers", {
    params: {
      page: 0,
      size: 20,
      sortBy: "name",
      sortDirection: "asc",
      ...filters,
    },
  });

  return response.data;
}

export async function getSupplier(id: string): Promise<Supplier> {
  const response = await api.get<Supplier>(`/suppliers/${id}`);
  return response.data;
}

export async function createSupplier(
  data: SupplierRequest
): Promise<Supplier> {
  const response = await api.post<Supplier>("/suppliers", data);
  return response.data;
}

export async function updateSupplier(
  id: string,
  data: SupplierRequest
): Promise<Supplier> {
  const response = await api.put<Supplier>(`/suppliers/${id}`, data);
  return response.data;
}

export async function deactivateSupplier(id: string): Promise<void> {
  await api.patch(`/suppliers/${id}/deactivate`);
}
