
package com.stockflow.warehouse;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface WarehouseRepository
        extends JpaRepository<Warehouse, UUID> {

    boolean existsByCodeIgnoreCase(String code);

    boolean existsByCodeIgnoreCaseAndIdNot(String code, UUID id);
}
