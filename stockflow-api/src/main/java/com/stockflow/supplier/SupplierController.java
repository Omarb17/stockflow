
package com.stockflow.supplier;

import com.stockflow.supplier.dto.SupplierRequest;
import com.stockflow.supplier.dto.SupplierResponse;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SupplierResponse create(
            @Valid @RequestBody SupplierRequest request
    ) {
        return supplierService.create(request);
    }

    @GetMapping
    public Page<SupplierResponse> findAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean active,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection
    ) {
        return supplierService.findAll(
                search,
                active,
                page,
                size,
                sortBy,
                sortDirection
        );
    }

    @GetMapping("/{id}")
    public SupplierResponse findById(@PathVariable UUID id) {
        return supplierService.findById(id);
    }

    @PutMapping("/{id}")
    public SupplierResponse update(
            @PathVariable UUID id,
            @Valid @RequestBody SupplierRequest request
    ) {
        return supplierService.update(id, request);
    }

    @PatchMapping("/{id}/deactivate")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deactivate(@PathVariable UUID id) {
        supplierService.deactivate(id);
    }
}
