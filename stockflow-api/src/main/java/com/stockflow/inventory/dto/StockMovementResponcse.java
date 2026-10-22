
package com.stockflow.inventory.dto;

import com.stockflow.inventory.StockMovement;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record StockMovementResponse(
    UUID id,
    UUID productId,
    String productName,
    String sku,
    UUID warehouseId,
    String warehouseName,
    StockMovement.Type type,
    BigDecimal quantity,
    BigDecimal quantityBefore,
    BigDecimal quantityAfter,
    String reason,
    UUID referenceId,
    Instant createdAt
) {
}
