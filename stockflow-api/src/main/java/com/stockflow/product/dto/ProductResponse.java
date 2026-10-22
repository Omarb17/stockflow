
package com.stockflow.product.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record ProductResponse(
    UUID id,
    String name,
    String sku,
    String description,
    UUID categoryId,
    String categoryName,
    String unit,
    BigDecimal costPrice,
    int reorderLevel,
    boolean active,
    Instant createdAt,
    Instant updatedAt
) {
}
