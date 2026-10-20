CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE categories (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
name VARCHAR(100) NOT NULL UNIQUE,
description VARCHAR(500),
created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX uq_categories_name_lower
ON categories (LOWER(name));

CREATE TABLE products (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
name VARCHAR(120) NOT NULL,
sku VARCHAR(50) NOT NULL UNIQUE,
description VARCHAR(1000),
category_id UUID NOT NULL,
unit VARCHAR(20) NOT NULL,
cost_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
reorder_level INTEGER NOT NULL DEFAULT 0,
active BOOLEAN NOT NULL DEFAULT TRUE,
created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_products_category
    FOREIGN KEY (category_id)
    REFERENCES categories(id),
CONSTRAINT chk_products_cost_price
    CHECK (cost_price >= 0),
CONSTRAINT chk_products_reorder_level
    CHECK (reorder_level >= 0)
);

CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_active ON products(active)
