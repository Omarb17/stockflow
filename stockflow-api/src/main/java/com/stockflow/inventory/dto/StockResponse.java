
package com.stockflow.inventory.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record StockResponse(
    UUID id,
    UUID productId,
    String productName,
    String sku,
    UUID warehouseId,
    String warehouseName,
    BigDecimal quantity,
    Instant updatedAt
) {
}
