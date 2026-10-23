package com.stockflow.purchaseorder.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record CreatePurchaseOrderRequest(

        @NotNull(message = "Supplier ID is required")
        UUID supplierId,

        LocalDate expectedDeliveryDate,

        @Size(max = 1000, message = "Notes cannot exceed 1000 characters")
        String notes,

        @NotNull(message = "Order items are required")
        @Size(min = 1, message = "An order must contain at least one item")
        List<@Valid PurchaseOrderItemRequest> items

) {
}