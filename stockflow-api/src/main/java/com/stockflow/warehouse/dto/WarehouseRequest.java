
package com.stockflow.warehouse.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record WarehouseRequest(
    @NotBlank
    @Size(max = 120)
    String name,

    @NotBlank
    @Size(max = 50)
    String code,

    @Size(max = 255)
    String address
) {
}
