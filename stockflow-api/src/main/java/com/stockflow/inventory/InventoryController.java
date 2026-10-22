
package com.stockflow.inventory;

import com.stockflow.inventory.dto.*;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService service;

    public InventoryController(InventoryService service) {
        this.service = service;
    }

    @GetMapping("/stock")
    public Page<StockResponse> findStock(
        @RequestParam(required = false) UUID warehouseId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        validatePage(page, size);

        return service.findStock(
            warehouseId,
            PageRequest.of(page, size, Sort.by("updatedAt").descending())
        );
    }

    @PostMapping("/receive")
    @ResponseStatus(HttpStatus.CREATED)
    public StockResponse receive(
        @Valid @RequestBody StockOperationRequest request
    ) {
        return service.receive(request);
    }

    @PostMapping("/issue")
    public StockResponse issue(
        @Valid @RequestBody StockOperationRequest request
    ) {
        return service.issue(request);
    }

    @PostMapping("/adjust")
    public StockResponse adjust(
        @Valid @RequestBody StockAdjustmentRequest request
    ) {
        return service.adjust(request);
    }

    @GetMapping("/movements")
    public Page<StockMovementResponse> movements(
        @RequestParam(required = false) UUID productId,
        @RequestParam(required = false) UUID warehouseId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        validatePage(page, size);

        return service.findMovements(
            productId,
            warehouseId,
            PageRequest.of(
                page,
                size,
                Sort.by("createdAt").descending()
            )
        );
    }

    private void validatePage(int page, int size) {
        if (page < 0 || size < 1 || size > 100) {
            throw new IllegalArgumentException(
                "Page must be non-negative and size must be between 1 and 100"
            );
        }
    }
}
