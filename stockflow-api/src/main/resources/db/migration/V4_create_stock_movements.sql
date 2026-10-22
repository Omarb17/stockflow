
CREATE TABLE stock_movements (
                                 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                                 product_id UUID NOT NULL,
                                 warehouse_id UUID NOT NULL,

                                 type VARCHAR(20) NOT NULL,
                                 quantity NUMERIC(14, 3) NOT NULL,
                                 quantity_before NUMERIC(14, 3) NOT NULL,
                                 quantity_after NUMERIC(14, 3) NOT NULL,

                                 reason VARCHAR(500),
                                 reference_id UUID,

                                 created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                 CONSTRAINT fk_stock_movements_product
                                     FOREIGN KEY (product_id)
                                         REFERENCES products(id),

                                 CONSTRAINT fk_stock_movements_warehouse
                                     FOREIGN KEY (warehouse_id)
                                         REFERENCES warehouses(id),

                                 CONSTRAINT chk_stock_movements_type
                                     CHECK (type IN (
                                                     'IN',
                                                     'OUT',
                                                     'ADJUSTMENT',
                                                     'TRANSFER_IN',
                                                     'TRANSFER_OUT'
                                         ))
);

CREATE INDEX idx_stock_movements_product_id
    ON stock_movements(product_id);

CREATE INDEX idx_stock_movements_warehouse_id
    ON stock_movements(warehouse_id);

CREATE INDEX idx_stock_movements_created_at
    ON stock_movements(created_at);
