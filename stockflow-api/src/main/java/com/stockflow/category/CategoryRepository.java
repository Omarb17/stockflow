
package com.stockflow.category;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, UUID> {

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, UUID id);

    @Query("""
        SELECT c FROM Category c
        WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%'))
           OR LOWER(COALESCE(c.description, '')) LIKE LOWER(CONCAT('%', :search, '%'))
        """)
    Page<Category> searchByText(
            @Param("search") String search,
            Pageable pageable
    );

    Page<Category> findByActive(boolean active, Pageable pageable);

    @Query("""
        SELECT c FROM Category c
        WHERE c.active = :active
          AND (
              LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%'))
              OR LOWER(COALESCE(c.description, '')) LIKE LOWER(CONCAT('%', :search, '%'))
          )
        """)
    Page<Category> searchByTextAndActive(
            @Param("search") String search,
            @Param("active") boolean active,
            Pageable pageable
    );
}
