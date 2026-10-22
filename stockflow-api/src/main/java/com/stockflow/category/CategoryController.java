
package com.stockflow.category;

import com.stockflow.category.dto.CategoryRequest;
import com.stockflow.category.dto.CategoryResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryResponse create(
        @Valid @RequestBody CategoryRequest request
    ) {
        return categoryService.create(request);
    }

    @GetMapping
    public Page<CategoryResponse> findAll(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) Boolean active,
        @PageableDefault(
            size = 20,
            sort = "name",
            direction = Sort.Direction.ASC
        ) Pageable pageable
    ) {
        return categoryService.findAll(search, active, pageable);
    }

    @GetMapping("/{id}")
    public CategoryResponse findById(@PathVariable UUID id) {
        return categoryService.findById(id);
    }

    @PutMapping("/{id}")
    public CategoryResponse update(
        @PathVariable UUID id,
        @Valid @RequestBody CategoryRequest request
    ) {
        return categoryService.update(id, request);
    }

    @PatchMapping("/{id}/archive")
    public CategoryResponse archive(@PathVariable UUID id) {
        return categoryService.archive(id);
    }
}
