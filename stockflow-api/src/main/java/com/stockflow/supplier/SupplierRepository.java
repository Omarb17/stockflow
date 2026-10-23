
package com.stockflow.supplier;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface SupplierRepository
        extends JpaRepository<Supplier, UUID> {

    @Query("""
        SELECT s FROM Supplier s
        WHERE (:active IS NULL OR s.active = :active)
          AND (
              :search IS NULL
              OR LOWER(s.name) LIKE LOWER(CONCAT('%', :search, '%'))
              OR LOWER(s.email) LIKE LOWER(CONCAT('%', :search, '%'))
              OR LOWER(s.contactPerson) LIKE LOWER(CONCAT('%', :search, '%'))
          )
        """)
    Page<Supplier> search(
            @Param("search") String search,
            @Param("active") Boolean active,
            Pageable pageable
    );
}
