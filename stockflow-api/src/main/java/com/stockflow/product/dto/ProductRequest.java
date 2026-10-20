package com.stockflow.product.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.UUID;

public record ProductRequest(

    @NotBlank(message = "Product name is required")
    @Size(min = 2, max = 120)
    String name,

    @NotBlank(message = "SKU is required")
    @Size(min = 2, max = 50)
    @Pattern(
        regexp = "^[A-Za-z0-9._-]+$",
        message = "SKU can contain letters, numbers, dots, underscores and hyphens"
    )
    String sku,

    @Size(max = 1000)
    String description,

    @NotNull(message = "Category is required")
    UUID categoryId,

    @NotBlank(message = "Unit is required")
    @Pattern(
        regexp = "^(piece|box|kg|g|liter|ml|meter|pack)$",
        flags = Pattern.Flag.CASE_INSENSITIVE,
        message = "Unit must be piece, box, kg, g, liter, ml, meter or pack"
    )
    String unit,

    @NotNull(message = "Cost price is required")
    @DecimalMin(value = "0.00", message = "Cost price cannot be negative")
    @Digits(integer = 10, fraction = 2, message = "Cost price supports at most 2 decimal places")
    BigDecimal costPrice,

    @NotNull(message = "Reorder level is required")
    @Min(value = 0, message = "Reorder level cannot be negative")
    Integer reorderLevel

) {}