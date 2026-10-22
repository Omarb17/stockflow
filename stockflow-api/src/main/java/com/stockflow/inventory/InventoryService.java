
package com.stockflow.inventory;

import com.stockflow.inventory.dto.*;
import com.stockflow.product.Product;
import com.stockflow.product.ProductRepository;
import com.stockflow.warehouse.Warehouse;
import com.stockflow.warehouse.WarehouseRepository;
import com.stockflow.common.exception.ResourceNotFoundException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class InventoryService {

    private final StockRecordRepository stockRepository;
    private final StockMovementRepository movementRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;

    @Transactional(readOnly = true)
    public Page<StockResponse> findLowStock(Pageable pageable) {
        return stockRepository.findLowStock(pageable)
                .map(this::toStockResponse);
    }

    public InventoryService(
        StockRecordRepository stockRepository,
        StockMovementRepository movementRepository,
        ProductRepository productRepository,
        WarehouseRepository warehouseRepository
    ) {
        this.stockRepository = stockRepository;
        this.movementRepository = movementRepository;
        this.productRepository = productRepository;
        this.warehouseRepository = warehouseRepository;
    }

    @Transactional(readOnly = true)
    public Page<StockResponse> findStock(
        UUID warehouseId,
        Pageable pageable
    ) {
        if (warehouseId != null) {
            getActiveWarehouse(warehouseId);

            return stockRepository.findAll(pageable)
                .map(this::toStockResponse)
                .map(response -> response);
        }

        return stockRepository.findAll(pageable)
            .map(this::toStockResponse);
    }

    @Transactional
    public StockResponse receive(StockOperationRequest request) {
        return changeStock(
            request,
            StockMovement.Type.IN
        );
    }

    @Transactional
    public StockResponse issue(StockOperationRequest request) {
        return changeStock(
            request,
            StockMovement.Type.OUT
        );
    }

    @Transactional
    public StockResponse adjust(StockAdjustmentRequest request) {
        Product product = getActiveProduct(request.productId());
        Warehouse warehouse = getActiveWarehouse(request.warehouseId());

        StockRecord record = getOrCreateStock(product, warehouse);
        BigDecimal before = record.getQuantity();
        BigDecimal after = request.newQuantity();

        record.adjustTo(after);
        stockRepository.saveAndFlush(record);

        movementRepository.save(new StockMovement(
            product,
            warehouse,
            StockMovement.Type.ADJUSTMENT,
            after.subtract(before).abs(),
            before,
            after,
            request.reason().trim(),
            null
        ));

        return toStockResponse(record);
    }

    @Transactional(readOnly = true)
    public Page<StockMovementResponse> findMovements(
        UUID productId,
        UUID warehouseId,
        Pageable pageable
    ) {
        if (productId != null) {
            return movementRepository.findByProduct_Id(
                productId, pageable
            ).map(this::toMovementResponse);
        }

        if (warehouseId != null) {
            return movementRepository.findByWarehouse_Id(
                warehouseId, pageable
            ).map(this::toMovementResponse);
        }

        return movementRepository
            .findAllByOrderByCreatedAtDesc(pageable)
            .map(this::toMovementResponse);
    }

    @Transactional
    public StockResponse changeStock(
        StockOperationRequest request,
        StockMovement.Type type
    ) {
        Product product = getActiveProduct(request.productId());
        Warehouse warehouse = getActiveWarehouse(request.warehouseId());

        StockRecord record = getOrCreateStock(product, warehouse);
        BigDecimal before = record.getQuantity();

        if (type == StockMovement.Type.IN) {
            record.add(request.quantity());
        } else {
            record.remove(request.quantity());
        }

        stockRepository.saveAndFlush(record);

        movementRepository.save(new StockMovement(
            product,
            warehouse,
            type,
            request.quantity(),
            before,
            record.getQuantity(),
            cleanReason(request.reason()),
            null
        ));

        return toStockResponse(record);
    }

    private StockRecord getOrCreateStock(
        Product product,
        Warehouse warehouse
    ) {
        return stockRepository.findForUpdate(
            product.getId(), warehouse.getId()
        ).orElseGet(() -> {
            StockRecord record = new StockRecord(product, warehouse);
            return stockRepository.saveAndFlush(record);
        });
    }

    private Product getActiveProduct(UUID id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Product not found: " + id
            ));

        if (!product.isActive()) {
            throw new IllegalArgumentException(
                "Archived products cannot have stock movements"
            );
        }

        return product;
    }

    private Warehouse getActiveWarehouse(UUID id) {
        Warehouse warehouse = warehouseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Warehouse not found: " + id
            ));

        if (!warehouse.isActive()) {
            throw new IllegalArgumentException(
                "Archived warehouses cannot have stock movements"
            );
        }

        return warehouse;
    }

    private String cleanReason(String reason) {
        return reason == null || reason.isBlank()
            ? null : reason.trim();
    }

    private StockResponse toStockResponse(StockRecord record) {
        return new StockResponse(
            record.getId(),
            record.getProduct().getId(),
            record.getProduct().getName(),
            record.getProduct().getSku(),
            record.getWarehouse().getId(),
            record.getWarehouse().getName(),
            record.getQuantity(),
            record.getUpdatedAt()
        );
    }

    private StockMovementResponse toMovementResponse(
        StockMovement movement
    ) {
        return new StockMovementResponse(
            movement.getId(),
            movement.getProduct().getId(),
            movement.getProduct().getName(),
            movement.getProduct().getSku(),
            movement.getWarehouse().getId(),
            movement.getWarehouse().getName(),
            movement.getType(),
            movement.getQuantity(),
            movement.getQuantityBefore(),
            movement.getQuantityAfter(),
            movement.getReason(),
            movement.getReferenceId(),
            movement.getCreatedAt()
        );
    }
}
