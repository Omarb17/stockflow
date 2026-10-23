package com.stockflow.purchaseorder.service;

import com.stockflow.product.ProductRepository;
import com.stockflow.purchaseorder.dto.CreatePurchaseOrderRequest;
import com.stockflow.purchaseorder.dto.PurchaseOrderItemRequest;
import com.stockflow.purchaseorder.dto.PurchaseOrderItemResponse;
import com.stockflow.purchaseorder.dto.PurchaseOrderResponse;
import com.stockflow.purchaseorder.entity.PurchaseOrder;
import com.stockflow.purchaseorder.entity.PurchaseOrderItem;
import com.stockflow.purchaseorder.repository.PurchaseOrderRepository;
import com.stockflow.supplier.SupplierRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;

    public PurchaseOrderService(
            PurchaseOrderRepository purchaseOrderRepository,
            SupplierRepository supplierRepository,
            ProductRepository productRepository
    ) {
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.supplierRepository = supplierRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public PurchaseOrderResponse create(CreatePurchaseOrderRequest request) {

        if (request.expectedDeliveryDate() != null
                && request.expectedDeliveryDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException(
                    "Expected delivery date cannot be in the past"
            );
        }

        var supplier = supplierRepository.findById(request.supplierId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Supplier not found: " + request.supplierId()
                ));

        PurchaseOrder order = new PurchaseOrder();
        order.setSupplier(supplier);
        order.setOrderNumber("PO-" + UUID.randomUUID());
        order.setExpectedDeliveryDate(request.expectedDeliveryDate());
        order.setNotes(request.notes());

        BigDecimal total = BigDecimal.ZERO;

        for (PurchaseOrderItemRequest itemRequest : request.items()) {

            var product = productRepository.findById(itemRequest.productId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Product not found: " + itemRequest.productId()
                    ));

            PurchaseOrderItem item = new PurchaseOrderItem();
            item.setProduct(product);
            item.setQuantity(itemRequest.quantity());
            item.setUnitCost(itemRequest.unitCost());

            BigDecimal lineTotal = itemRequest.unitCost()
                    .multiply(BigDecimal.valueOf(itemRequest.quantity()));

            total = total.add(lineTotal);

            order.addItem(item);
        }

        order.setTotalAmount(total);

        PurchaseOrder saved = purchaseOrderRepository.save(order);

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public PurchaseOrderResponse getById(UUID id) {

        PurchaseOrder order = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Purchase order not found: " + id
                ));

        return toResponse(order);
    }

    @Transactional(readOnly = true)
    public List<PurchaseOrderResponse> getAll() {
        return purchaseOrderRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private PurchaseOrderResponse toResponse(PurchaseOrder order) {

        List<PurchaseOrderItemResponse> items = order.getItems()
                .stream()
                .map(item -> new PurchaseOrderItemResponse(
                        item.getId(),
                        item.getProduct().getId(),
                        item.getQuantity(),
                        item.getUnitCost(),
                        item.getLineTotal()
                ))
                .toList();

        return new PurchaseOrderResponse(
                order.getId(),
                order.getSupplier().getId(),
                order.getSupplier().getName(),
                order.getOrderNumber(),
                order.getStatus(),
                order.getOrderDate(),
                order.getExpectedDeliveryDate(),
                order.getNotes(),
                order.getTotalAmount(),
                items,
                order.getCreatedAt(),
                order.getUpdatedAt()
        );
    }
}