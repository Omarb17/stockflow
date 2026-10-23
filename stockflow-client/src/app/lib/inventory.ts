
import api from "@/app/lib/api";

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StockRecord {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  warehouseId: string;
  warehouseName: string;
  quantity: number;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  warehouseId: string;
  warehouseName: string;
  type: "IN" | "OUT" | "ADJUSTMENT" | "TRANSFER_IN" | "TRANSFER_OUT";
  quantity: number;
  quantityBefore: number;
  quantityAfter: number;
  reason: string | null;
  referenceId: string | null;
  createdAt: string;
}

export interface StockOperationRequest {
  productId: string;
  warehouseId: string;
  quantity: number;
  reason?: string;
}

export interface StockAdjustmentRequest {
  productId: string;
  warehouseId: string;
  newQuantity: number;
  reason: string;
}

export async function getStock(): Promise<PageResponse<StockRecord>> {
  const response = await api.get<PageResponse<StockRecord>>(
    "/inventory/stock",
    { params: { page: 0, size: 100 } }
  );

  return response.data;
}

export async function getLowStock(): Promise<PageResponse<StockRecord>> {
  const response = await api.get<PageResponse<StockRecord>>(
    "/inventory/low-stock",
    { params: { page: 0, size: 100 } }
  );

  return response.data;
}

export async function getStockMovements(): Promise<
  PageResponse<StockMovement>
> {
  const response = await api.get<PageResponse<StockMovement>>(
    "/inventory/movements",
    { params: { page: 0, size: 100 } }
  );

  return response.data;
}

export async function getWarehouses(): Promise<Warehouse[]> {
  const response = await api.get<Warehouse[]>("/warehouses");
  return response.data;
}

export async function receiveStock(
  data: StockOperationRequest
): Promise<StockRecord> {
  const response = await api.post<StockRecord>(
    "/inventory/receive",
    data
  );

  return response.data;
}

export async function issueStock(
  data: StockOperationRequest
): Promise<StockRecord> {
  const response = await api.post<StockRecord>(
    "/inventory/issue",
    data
  );

  return response.data;
}

export async function adjustStock(
  data: StockAdjustmentRequest
): Promise<StockRecord> {
  const response = await api.post<StockRecord>(
    "/inventory/adjust",
    data
  );

  return response.data;
}
