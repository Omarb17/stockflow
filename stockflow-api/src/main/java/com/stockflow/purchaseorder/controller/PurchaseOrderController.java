
package com.stockflow.purchaseorder.controller;

import com.stockflow.purchaseorder.dto.CreatePurchaseOrderRequest;
import com.stockflow.purchaseorder.dto.PurchaseOrderResponse;
import com.stockflow.purchaseorder.service.PurchaseOrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/purchase-orders")
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    public PurchaseOrderController(
            PurchaseOrderService purchaseOrderService
    ) {
        this.purchaseOrderService = purchaseOrderService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PurchaseOrderResponse create(
            @Valid @RequestBody CreatePurchaseOrderRequest request
    ) {
        return purchaseOrderService.create(request);
    }

    @GetMapping
    public List<PurchaseOrderResponse> getAll() {
        return purchaseOrderService.getAll();
    }

    @GetMapping("/{id}")
    public PurchaseOrderResponse getById(
            @PathVariable UUID id
    ) {
        return purchaseOrderService.getById(id);
    }
}
