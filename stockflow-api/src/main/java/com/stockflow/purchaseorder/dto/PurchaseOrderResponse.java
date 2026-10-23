package com.stockflow.purchaseorder.dto;

import com.stockflow.purchaseorder.entity.PurchaseOrderStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record PurchaseOrderResponse(
        UUID id,
        UUID supplierId,
        String supplierName,
        String orderNumber,
        PurchaseOrderStatus status,
        LocalDate orderDate,
        LocalDate expectedDeliveryDate,
        String notes,
        BigDecimal totalAmount,
        List<PurchaseOrderItemResponse> items,
        Instant createdAt,
        Instant updatedAt
) {
}