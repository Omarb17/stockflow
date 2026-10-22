
package com.stockflow.inventory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface StockMovementRepository
        extends JpaRepository<StockMovement, UUID> {

    Page<StockMovement> findByProduct_Id(
        UUID productId,
        Pageable pageable
    );

    Page<StockMovement> findByWarehouse_Id(
        UUID warehouseId,
        Pageable pageable
    );

    Page<StockMovement> findAllByOrderByCreatedAtDesc(
        Pageable pageable
    );
}
