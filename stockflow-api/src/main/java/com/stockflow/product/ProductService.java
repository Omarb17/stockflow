
package com.stockflow.product;

import com.stockflow.category.Category;
import com.stockflow.category.CategoryRepository;
import com.stockflow.common.exception.DuplicateResourceException;
import com.stockflow.common.exception.ResourceNotFoundException;
import com.stockflow.product.dto.ProductRequest;
import com.stockflow.product.dto.ProductResponse;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;
import java.util.UUID;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(
        ProductRepository productRepository,
        CategoryRepository categoryRepository
    ) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        String sku = normalizeSku(request.sku());

        if (productRepository.existsBySkuIgnoreCase(sku)) {
            throw new DuplicateResourceException("SKU already exists");
        }

        Category category = getActiveCategory(request.categoryId());

        Product product = new Product(
            request.name().trim(),
            sku,
            cleanDescription(request.description()),
            category,
            normalizeUnit(request.unit()),
            request.costPrice(),
            request.reorderLevel()
        );

        try {
            return toResponse(productRepository.saveAndFlush(product));
        } catch (DataIntegrityViolationException exception) {
            throw new DuplicateResourceException(
                "SKU already exists or product data violates a database constraint"
            );
        }
    }

    @Transactional(readOnly = true)
    public Page<ProductResponse> findAll(
        String search,
        UUID categoryId,
        Boolean active,
        int page,
        int size,
        String sortBy,
        String sortDirection
    ) {
        if (page < 0) {
            throw new IllegalArgumentException(
                "Page cannot be negative"
            );
        }

        if (size < 1 || size > 100) {
            throw new IllegalArgumentException(
                "Page size must be between 1 and 100"
            );
        }

        if (sortBy == null || !isAllowedSortField(sortBy)) {
            throw new IllegalArgumentException(
                "Unsupported sort field"
            );
        }

        if (sortDirection == null) {
            throw new IllegalArgumentException(
                "Sort direction must be 'asc' or 'desc'"
            );
        }

        Sort.Direction direction;

        try {
            direction = Sort.Direction.fromString(sortDirection);
        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException(
                "Sort direction must be 'asc' or 'desc'"
            );
        }

        Pageable pageable = PageRequest.of(
            page,
            size,
            Sort.by(direction, sortBy)
        );

        String normalizedSearch =
            search == null || search.isBlank()
                ? null
                : search.trim();

        return productRepository.search(
            normalizedSearch,
            categoryId,
            active,
            pageable
        ).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public ProductResponse findById(UUID id) {
        return toResponse(getProduct(id));
    }

    @Transactional
    public ProductResponse update(
        UUID id,
        ProductRequest request
    ) {
        Product product = getProduct(id);

        if (!product.isActive()) {
            throw new IllegalArgumentException(
                "Archived products cannot be updated"
            );
        }

        String sku = normalizeSku(request.sku());

        if (productRepository.existsBySkuIgnoreCaseAndIdNot(sku, id)) {
            throw new DuplicateResourceException("SKU already exists");
        }

        Category category = getActiveCategory(request.categoryId());

        product.updateDetails(
            request.name().trim(),
            sku,
            cleanDescription(request.description()),
            category,
            normalizeUnit(request.unit()),
            request.costPrice(),
            request.reorderLevel()
        );

        try {
            return toResponse(productRepository.saveAndFlush(product));
        } catch (DataIntegrityViolationException exception) {
            throw new DuplicateResourceException(
                "SKU already exists or product data violates a database constraint"
            );
        }
    }

    @Transactional
    public void archive(UUID id) {
        Product product = getProduct(id);
        product.archive();
    }

    private Product getProduct(UUID id) {
        return productRepository.findById(id)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Product not found: " + id
                )
            );
    }

    private Category getActiveCategory(UUID id) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Category not found: " + id
                )
            );

        if (!category.isActive()) {
            throw new IllegalArgumentException(
                "Cannot assign an archived category to a product"
            );
        }

        return category;
    }

    private boolean isAllowedSortField(String sortBy) {
        return switch (sortBy) {
            case "name", "sku", "costPrice",
                 "createdAt", "updatedAt" -> true;
            default -> false;
        };
    }

    private String normalizeSku(String sku) {
        return sku.trim().toUpperCase(Locale.ROOT);
    }

    private String normalizeUnit(String unit) {
        return unit.trim().toLowerCase(Locale.ROOT);
    }

    private String cleanDescription(String description) {
        if (description == null || description.isBlank()) {
            return null;
        }

        return description.trim();
    }

    private ProductResponse toResponse(Product product) {
        return new ProductResponse(
            product.getId(),
            product.getName(),
            product.getSku(),
            product.getDescription(),
            product.getCategory().getId(),
            product.getCategory().getName(),
            product.getUnit(),
            product.getCostPrice(),
            product.getReorderLevel(),
            product.isActive(),
            product.getCreatedAt(),
            product.getUpdatedAt()
        );
    }
}
