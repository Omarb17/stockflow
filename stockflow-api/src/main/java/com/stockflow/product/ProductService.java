package com.stockflow.product;

import com.stockflow.category.Category;
import com.stockflow.category.CategoryRepository;
import com.stockflow.common.exception.DuplicateResourceException;
import com.stockflow.common.exception.ResourceNotFoundException;
import com.stockflow.product.dto.ProductRequest;
import com.stockflow.product.dto.ProductResponse;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        String sku = request.sku().trim();

        if (productRepository.existsBySkuIgnoreCase(sku)) {
            throw new DuplicateResourceException("SKU already exists");
        }

        Category category = getCategory(request.categoryId());

        Product product = new Product(
            request.name().trim(),
            sku,
            cleanDescription(request.description()),
            category,
            request.unit().trim().toLowerCase(),
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
            throw new IllegalArgumentException("Page cannot be negative");
        }

        if (size < 1 || size > 100) {
            throw new IllegalArgumentException("Page size must be between 1 and 100");
        }

        if (!sortBy.equals("name")
            && !sortBy.equals("sku")
            && !sortBy.equals("costPrice")
            && !sortBy.equals("createdAt")
            && !sortBy.equals("updatedAt")) {
            throw new IllegalArgumentException("Unsupported sort field");
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
            search == null || search.isBlank() ? null : search.trim();

        return productRepository.search(
            normalizedSearch, categoryId, active, pageable
        ).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public ProductResponse findById(UUID id) {
        return toResponse(getProduct(id));
    }

    @Transactional
    public ProductResponse update(UUID id, ProductRequest request) {
        Product product = getProduct(id);
        String sku = request.sku().trim();

        if (productRepository.existsBySkuIgnoreCaseAndIdNot(sku, id)) {
            throw new DuplicateResourceException("SKU already exists");
        }

        Category category = getCategory(request.categoryId());

        product.updateDetails(
            request.name().trim(),
            sku,
            cleanDescription(request.description()),
            category,
            request.unit().trim().toLowerCase(),
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
                new ResourceNotFoundException("Product not found: " + id)
            );
    }

    private Category getCategory(UUID id) {
        return categoryRepository.findById(id)
            .orElseThrow(() ->
                new ResourceNotFoundException("Category not found: " + id)
            );
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