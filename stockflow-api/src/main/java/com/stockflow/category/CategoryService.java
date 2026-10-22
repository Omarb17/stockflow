
package com.stockflow.category;

import com.stockflow.category.dto.CategoryRequest;
import com.stockflow.category.dto.CategoryResponse;
import com.stockflow.common.exception.DuplicateResourceException;
import com.stockflow.common.exception.ResourceNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public CategoryResponse create(CategoryRequest request) {
        String name = normalizeName(request.name());

        if (categoryRepository.existsByNameIgnoreCase(name)) {
            throw new DuplicateResourceException(
                "A category with this name already exists"
            );
        }

        Category category = new Category(
            name,
            cleanDescription(request.description())
        );

        try {
            return toResponse(categoryRepository.saveAndFlush(category));
        } catch (DataIntegrityViolationException exception) {
            throw new DuplicateResourceException(
                "A category with this name already exists"
            );
        }
    }

    @Transactional(readOnly = true)
    public Page<CategoryResponse> findAll(
        String search,
        Boolean active,
        Pageable pageable
    ) {
        String normalizedSearch =
            search == null || search.isBlank()
                ? null
                : search.trim();

        return categoryRepository
            .search(normalizedSearch, active, pageable)
            .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public CategoryResponse findById(UUID id) {
        return toResponse(getCategory(id));
    }

    @Transactional
    public CategoryResponse update(
        UUID id,
        CategoryRequest request
    ) {
        Category category = getCategory(id);
        String name = normalizeName(request.name());

        if (categoryRepository.existsByNameIgnoreCaseAndIdNot(
                name, id)) {
            throw new DuplicateResourceException(
                "A category with this name already exists"
            );
        }

        category.setName(name);
        category.setDescription(
            cleanDescription(request.description())
        );

        try {
            return toResponse(categoryRepository.saveAndFlush(category));
        } catch (DataIntegrityViolationException exception) {
            throw new DuplicateResourceException(
                "A category with this name already exists"
            );
        }
    }

    @Transactional
    public CategoryResponse archive(UUID id) {
        Category category = getCategory(id);
        category.setActive(false);

        return toResponse(categoryRepository.save(category));
    }

    private Category getCategory(UUID id) {
        return categoryRepository.findById(id)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Category not found: " + id
                )
            );
    }

    private String normalizeName(String name) {
        return name.trim();
    }

    private String cleanDescription(String description) {
        if (description == null || description.isBlank()) {
            return null;
        }

        return description.trim();
    }

    private CategoryResponse toResponse(Category category) {
        return new CategoryResponse(
            category.getId(),
            category.getName(),
            category.getDescription(),
            category.isActive(),
            category.getCreatedAt(),
            category.getUpdatedAt()
        );
    }
}
