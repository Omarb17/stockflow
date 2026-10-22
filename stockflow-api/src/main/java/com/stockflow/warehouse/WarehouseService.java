
package com.stockflow.warehouse;

import com.stockflow.common.exception.DuplicateResourceException;
import com.stockflow.common.exception.ResourceNotFoundException;
import com.stockflow.warehouse.dto.WarehouseRequest;
import com.stockflow.warehouse.dto.WarehouseResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class WarehouseService {

    private final WarehouseRepository repository;

    public WarehouseService(WarehouseRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public WarehouseResponse create(WarehouseRequest request) {
        String code = normalizeCode(request.code());

        if (repository.existsByCodeIgnoreCase(code)) {
            throw new DuplicateResourceException(
                "Warehouse code already exists"
            );
        }

        Warehouse warehouse = new Warehouse(
            request.name().trim(),
            code,
            clean(request.address())
        );

        return toResponse(repository.save(warehouse));
    }

    @Transactional(readOnly = true)
    public List<WarehouseResponse> findAll() {
        return repository.findAll().stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public WarehouseResponse findById(UUID id) {
        return toResponse(getWarehouse(id));
    }

    @Transactional
    public WarehouseResponse update(
        UUID id,
        WarehouseRequest request
    ) {
        Warehouse warehouse = getWarehouse(id);
        String code = normalizeCode(request.code());

        if (repository.existsByCodeIgnoreCaseAndIdNot(code, id)) {
            throw new DuplicateResourceException(
                "Warehouse code already exists"
            );
        }

        warehouse.updateDetails(
            request.name().trim(),
            code,
            clean(request.address())
        );

        return toResponse(repository.save(warehouse));
    }

    @Transactional
    public WarehouseResponse archive(UUID id) {
        Warehouse warehouse = getWarehouse(id);
        warehouse.archive();
        return toResponse(repository.save(warehouse));
    }

    private Warehouse getWarehouse(UUID id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Warehouse not found: " + id
            ));
    }

    private String normalizeCode(String code) {
        return code.trim().toUpperCase(Locale.ROOT);
    }

    private String clean(String value) {
        return value == null || value.isBlank()
            ? null : value.trim();
    }

    private WarehouseResponse toResponse(Warehouse warehouse) {
        return new WarehouseResponse(
            warehouse.getId(),
            warehouse.getName(),
            warehouse.getCode(),
            warehouse.getAddress(),
            warehouse.isActive(),
            warehouse.getCreatedAt(),
            warehouse.getUpdatedAt()
        );
    }
}
