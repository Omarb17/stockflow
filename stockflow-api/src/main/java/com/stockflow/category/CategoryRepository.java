
package com.stockflow.category;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface CategoryRepository
        extends JpaRepository<Category, UUID> {

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(
        String name,
        UUID id
    );

    @Query("""
        SELECT c FROM Category c
        WHERE (:search IS NULL
            OR LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(c.description) LIKE LOWER(CONCAT('%', :search, '%')))
        AND (:active IS NULL OR c.active = :active)
        """)
    Page<Category> search(
        @Param("search") String search,
        @Param("active") Boolean active,
        Pageable pageable
    );
}
