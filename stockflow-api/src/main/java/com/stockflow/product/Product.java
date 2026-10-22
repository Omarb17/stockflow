package com.stockflow.product;

import com.stockflow.category.Category;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, unique = true, length = 50)
    private String sku;

    @Column(length = 1000)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false, length = 20)
    private String unit;

    @Column(name = "cost_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal costPrice;

    @Column(name = "reorder_level", nullable = false)
    private int reorderLevel;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected Product() {
    }

    public Product(
        String name,
        String sku,
        String description,
        Category category,
        String unit,
        BigDecimal costPrice,
        int reorderLevel
    ) {
        this.name = name;
        this.sku = sku;
        this.description = description;
        this.category = category;
        this.unit = unit;
        this.costPrice = costPrice;
        this.reorderLevel = reorderLevel;
    }

    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }

    public void updateDetails(
        String name,
        String sku,
        String description,
        Category category,
        String unit,
        BigDecimal costPrice,
        int reorderLevel
    ) {
        this.name = name;
        this.sku = sku;
        this.description = description;
        this.category = category;
        this.unit = unit;
        this.costPrice = costPrice;
        this.reorderLevel = reorderLevel;
    }

    public void archive() {
        this.active = false;
    }

    public UUID getId() { return id; }
    public String getName() { return name; }
    public String getSku() { return sku; }
    public String getDescription() { return description; }
    public Category getCategory() { return category; }
    public String getUnit() { return unit; }
    public BigDecimal getCostPrice() { return costPrice; }
    public int getReorderLevel() { return reorderLevel; }
    public boolean isActive() { return active; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}