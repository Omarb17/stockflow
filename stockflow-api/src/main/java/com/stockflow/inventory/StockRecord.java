
package com.stockflow.inventory;

import com.stockflow.product.Product;
import com.stockflow.warehouse.Warehouse;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
    name = "stock_records",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_stock_product_warehouse",
        columnNames = {"product_id", "warehouse_id"}
    )
)
public class StockRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @Column(nullable = false, precision = 14, scale = 3)
    private BigDecimal quantity = BigDecimal.ZERO;

    @Version
    private Long version;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected StockRecord() {
    }

    public StockRecord(Product product, Warehouse warehouse) {
        this.product = product;
        this.warehouse = warehouse;
        this.quantity = BigDecimal.ZERO;
    }

    public void add(BigDecimal amount) {
        requirePositive(amount);
        quantity = quantity.add(amount);
    }

    public void remove(BigDecimal amount) {
        requirePositive(amount);

        if (quantity.compareTo(amount) < 0) {
            throw new IllegalArgumentException(
                "Insufficient stock. Available: " + quantity
            );
        }

        quantity = quantity.subtract(amount);
    }

    public void adjustTo(BigDecimal newQuantity) {
        if (newQuantity == null ||
            newQuantity.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException(
                "Stock quantity cannot be negative"
            );
        }

        quantity = newQuantity;
    }

    private void requirePositive(BigDecimal amount) {
        if (amount == null ||
            amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                "Quantity must be greater than zero"
            );
        }
    }

    @PrePersist
    @PreUpdate
    protected void onSave() {
        updatedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public Product getProduct() { return product; }
    public Warehouse getWarehouse() { return warehouse; }
    public BigDecimal getQuantity() { return quantity; }
    public Instant getUpdatedAt() { return updatedAt; }
}
