
package com.stockflow.supplier;

import com.stockflow.supplier.dto.SupplierRequest;
import com.stockflow.supplier.dto.SupplierResponse;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Set;
import java.util.UUID;

@Service
@Transactional
public class SupplierService {

    private final SupplierRepository supplierRepository;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "name", "email", "createdAt", "updatedAt"
    );

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    public SupplierResponse create(SupplierRequest request) {
        Supplier supplier = new Supplier(
                request.name().trim(),
                request.contactPerson(),
                request.email(),
                request.phone(),
                request.address(),
                request.taxNumber()
        );

        return toResponse(supplierRepository.save(supplier));
    }

    @Transactional(readOnly = true)
    public Page<SupplierResponse> findAll(
            String search,
            Boolean active,
            int page,
            int size,
            String sortBy,
            String sortDirection
    ) {
        if (page < 0 || size < 1 || size > 100) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Page must be non-negative and size must be between 1 and 100"
            );
        }

        String field = ALLOWED_SORT_FIELDS.contains(sortBy)
                ? sortBy
                : "name";

        Sort.Direction direction =
                "desc".equalsIgnoreCase(sortDirection)
                        ? Sort.Direction.DESC
                        : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(direction, field)
        );

        String normalizedSearch =
                search == null || search.isBlank()
                        ? null
                        : search.trim();

        return supplierRepository
                .search(normalizedSearch, active, pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public SupplierResponse findById(UUID id) {
        return toResponse(getSupplier(id));
    }

    public SupplierResponse update(UUID id, SupplierRequest request) {
        Supplier supplier = getSupplier(id);

        supplier.updateDetails(
                request.name().trim(),
                request.contactPerson(),
                request.email(),
                request.phone(),
                request.address(),
                request.taxNumber()
        );

        return toResponse(supplierRepository.save(supplier));
    }

    public void deactivate(UUID id) {
        Supplier supplier = getSupplier(id);
        supplier.deactivate();
        supplierRepository.save(supplier);
    }

    private Supplier getSupplier(UUID id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Supplier not found"
                ));
    }

    private SupplierResponse toResponse(Supplier supplier) {
        return new SupplierResponse(
                supplier.getId(),
                supplier.getName(),
                supplier.getContactPerson(),
                supplier.getEmail(),
                supplier.getPhone(),
                supplier.getAddress(),
                supplier.getTaxNumber(),
                supplier.isActive(),
                supplier.getCreatedAt(),
                supplier.getUpdatedAt()
        );
    }
}
