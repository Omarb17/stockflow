
package com.stockflow.product.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.UUID;

public record ProductRequest(

    @NotBlank(message = "Product name is required")
    @Size(max = 120, message = "Product name cannot exceed 120 characters")
    String name,

    @NotBlank(message = "SKU is required")
    @Size(max = 50, message = "SKU cannot exceed 50 characters")
    String sku,

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    String description,

    @NotNull(message = "Category is required")
    UUID categoryId,

    @NotBlank(message = "Unit is required")
    @Size(max = 20, message = "Unit cannot exceed 20 characters")
    String unit,

    @NotNull(message = "Cost price is required")
    @DecimalMin(value = "0.00", message = "Cost price cannot be negative")
    @Digits(integer = 10, fraction = 2,
        message = "Cost price must have at most 10 integer digits and 2 decimal places")
    BigDecimal costPrice,

    @PositiveOrZero(message = "Reorder level cannot be negative")
    int reorderLevel

) {
}
