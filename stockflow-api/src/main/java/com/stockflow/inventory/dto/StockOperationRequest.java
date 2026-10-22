
package com.stockflow.inventory.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.UUID;

public record StockOperationRequest(

    @NotNull
    UUID productId,

    @NotNull
    UUID warehouseId,

    @NotNull
    @DecimalMin(value = "0.001")
    BigDecimal quantity,

    @Size(max = 500)
    String reason

) {
}
