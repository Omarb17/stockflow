
package com.stockflow.warehouse;

import com.stockflow.warehouse.dto.WarehouseRequest;
import com.stockflow.warehouse.dto.WarehouseResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/warehouses")
public class WarehouseController {

    private final WarehouseService service;

    public WarehouseController(WarehouseService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public WarehouseResponse create(
        @Valid @RequestBody WarehouseRequest request
    ) {
        return service.create(request);
    }

    @GetMapping
    public List<WarehouseResponse> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public WarehouseResponse findById(@PathVariable UUID id) {
        return service.findById(id);
    }

    @PutMapping("/{id}")
    public WarehouseResponse update(
        @PathVariable UUID id,
        @Valid @RequestBody WarehouseRequest request
    ) {
        return service.update(id, request);
    }

    @PatchMapping("/{id}/archive")
    public WarehouseResponse archive(@PathVariable UUID id) {
        return service.archive(id);
    }
}
