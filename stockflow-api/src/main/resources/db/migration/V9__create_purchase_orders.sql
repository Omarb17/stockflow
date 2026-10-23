
CREATE TABLE purchase_orders (
                                 id UUID PRIMARY KEY,
                                 supplier_id UUID NOT NULL,
                                 order_number VARCHAR(50) NOT NULL UNIQUE,
                                 status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
                                 order_date DATE NOT NULL,
                                 expected_delivery_date DATE,
                                 notes VARCHAR(1000),
                                 total_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
                                 created_at TIMESTAMP WITH TIME ZONE NOT NULL,
                                 updated_at TIMESTAMP WITH TIME ZONE NOT NULL,

                                 CONSTRAINT fk_purchase_orders_supplier
                                     FOREIGN KEY (supplier_id)
                                         REFERENCES suppliers(id),

                                 CONSTRAINT chk_purchase_orders_status
                                     CHECK (status IN ('DRAFT', 'APPROVED', 'RECEIVED', 'CANCELLED')),

                                 CONSTRAINT chk_purchase_orders_total
                                     CHECK (total_amount >= 0)
);

CREATE TABLE purchase_order_items (
                                      id UUID PRIMARY KEY,
                                      purchase_order_id UUID NOT NULL,
                                      product_id UUID NOT NULL,
                                      quantity INTEGER NOT NULL,
                                      unit_cost NUMERIC(14, 2) NOT NULL,
                                      line_total NUMERIC(14, 2) NOT NULL,

                                      CONSTRAINT fk_purchase_order_items_order
                                          FOREIGN KEY (purchase_order_id)
                                              REFERENCES purchase_orders(id)
                                              ON DELETE CASCADE,

                                      CONSTRAINT fk_purchase_order_items_product
                                          FOREIGN KEY (product_id)
                                              REFERENCES products(id),

                                      CONSTRAINT chk_purchase_order_items_quantity
                                          CHECK (quantity > 0),

                                      CONSTRAINT chk_purchase_order_items_unit_cost
                                          CHECK (unit_cost >= 0),

                                      CONSTRAINT chk_purchase_order_items_line_total
                                          CHECK (line_total >= 0)
);

CREATE INDEX idx_purchase_orders_supplier
    ON purchase_orders(supplier_id);

CREATE INDEX idx_purchase_orders_status
    ON purchase_orders(status);

CREATE INDEX idx_purchase_order_items_order
    ON purchase_order_items(purchase_order_id);
