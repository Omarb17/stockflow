CREATE TABLE stock_records (
                               id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                               product_id UUID NOT NULL,
                               warehouse_id UUID NOT NULL,

                               quantity NUMERIC(14, 3) NOT NULL DEFAULT 0,
                               updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                               CONSTRAINT fk_stock_records_product
                                   FOREIGN KEY (product_id) REFERENCES products(id),

                               CONSTRAINT fk_stock_records_warehouse
                                   FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),

                               CONSTRAINT uq_stock_records_product_warehouse
                                   UNIQUE (product_id, warehouse_id),

                               CONSTRAINT chk_stock_records_quantity
                                   CHECK (quantity >= 0)
);

CREATE INDEX idx_stock_records_product_id
    ON stock_records(product_id);

CREATE INDEX idx_stock_records_warehouse_id
    ON stock_records(warehouse_id);