package com.stockflow.purchaseorder.repository;

import com.stockflow.purchaseorder.entity.PurchaseOrder;
import com.stockflow.purchaseorder.entity.PurchaseOrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PurchaseOrderRepository
        extends JpaRepository<PurchaseOrder, UUID> {

    boolean existsByOrderNumber(String orderNumber);

    List<PurchaseOrder> findBySupplierId(UUID supplierId);

    List<PurchaseOrder> findByStatus(PurchaseOrderStatus status);
}