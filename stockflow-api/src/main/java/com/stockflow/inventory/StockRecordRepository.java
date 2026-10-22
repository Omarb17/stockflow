
package com.stockflow.inventory;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface StockRecordRepository
        extends JpaRepository<StockRecord, UUID> {

    Optional<StockRecord> findByProduct_IdAndWarehouse_Id(
        UUID productId,
        UUID warehouseId
    );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        SELECT s FROM StockRecord s
        WHERE s.product.id = :productId
        AND s.warehouse.id = :warehouseId
        """)
    Optional<StockRecord> findForUpdate(
        @Param("productId") UUID productId,
        @Param("warehouseId") UUID warehouseId
    );

    List<StockRecord> findByWarehouse_Id(UUID warehouseId);

    List<StockRecord> findByProduct_Id(UUID productId);

    Page<StockRecord> findByWarehouse_Id(
    UUID warehouseId,
    Pageable pageable
);
}
