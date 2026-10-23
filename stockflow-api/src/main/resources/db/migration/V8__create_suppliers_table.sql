
CREATE TABLE suppliers (
                           id UUID PRIMARY KEY,
                           name VARCHAR(150) NOT NULL,
                           contact_person VARCHAR(120),
                           email VARCHAR(180),
                           phone VARCHAR(30),
                           address VARCHAR(500),
                           tax_number VARCHAR(100),
                           active BOOLEAN NOT NULL DEFAULT TRUE,
                           created_at TIMESTAMP WITH TIME ZONE NOT NULL,
                           updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);
