package com.stockflow.purchaseorder.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record PurchaseOrderItemResponse(
        UUID id,
        UUID productId,
        Integer quantity,
        BigDecimal unitCost,
        BigDecimal lineTotal
) {
}