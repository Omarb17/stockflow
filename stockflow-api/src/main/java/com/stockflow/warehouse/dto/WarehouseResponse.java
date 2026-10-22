
package com.stockflow.warehouse.dto;

import java.time.Instant;
import java.util.UUID;

public record WarehouseResponse(
    UUID id,
    String name,
    String code,
    String address,
    boolean active,
    Instant createdAt,
    Instant updatedAt
) {
}
